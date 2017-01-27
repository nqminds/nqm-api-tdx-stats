module.exports = (function() {
  "use strict";

  const constants = require("./constants");
  const _ = require("lodash");
  const Promise = require("bluebird");
 
  // Extract the fields of type "$name" from a type
  // Example type = {"$min": "$name"}
  // Return: ["$name"]
  const extractFields = function(type, fields) {
    const newFields = [];
    const queue = [];

    // Add the initial set of object values to the stack
    _.forEach(_.values(type), (item) => queue.push(item));

    // Use depth first search algorithm to enumerate the values from the object
    while (queue.length) {
      // Retrieve the top element from the stack
      const val = queue.pop();

      if (_.isString(val)) {
        if (val.length) {
          const nval = val[0] === "$" ? val.substring(1) : val;
          // Check if it's not a mongodb operand or a field
          if (val !== constants.fieldStrKey && constants.mongoDbExpr.indexOf(val) < 0 &&
              fields.indexOf(nval) < 0)
            newFields.push(nval);
        }
      } else if (_.isObject(val))
        _.forEach(_.values(val), (item) => queue.push(item));
    }

    return newFields;
  };

  // Returns the object {count: 0, field1: [0, 0, 0, ...], field2: [0, 0, 0, ...], ...}
  const getInitAccumulator = function(fields, types) {
    const init = {};
    init[constants.countResultFieldName] = 0;
    _.forEach(fields, (field) => {
      init[field] = new Array(types.length);
      _.forEach(types, (type, idx) => {
        const keys = _.keys(type);
        // Assign default values to the accumulator
        // Only special case is "$min"
        if (keys[0] === "$min")
          init[field][idx] = Infinity;
        else
          init[field][idx] = 0;
      });
    });

    return init;
  };

  // Return the object {field1: 1, field2: 1, ...} from fields = [field1, field2, ...]
  const getProject = function(fields) {
    const project = {};
    _.forEach(fields, (key) => {
      if (key !== "")
        project[key] = 1;
    });

    return project;
  };

  // Return the object {field1: ord, field2: ord, ...} from fields = [field1, field2, ...] and order={1,-1}
  const getSort = function(fields, order) {
    const sort = {};
    _.forEach(fields, (key) => {
      sort[key] = order;
    });

    return sort;
  };

  // Function to compute the query filter based on keyd bounds
  // From bounds = {"key1":"val1", "key2":"val2"} it transforms to
  // {"$or":[{"$and":{"key1":{"$eq":"val1"}, "key2":{"$gt":"val2"}}}, {"key1":{"$gt":"val1"}]}
  const computeBounds = (bounds) => {
    let filter = {};
    const keys = _.keys(bounds);
    const keyQueue = [];
    const orList = [];

    _.forEach(keys, (key) => {
      keyQueue.push(key);
      const popQueue = _.slice(keyQueue);

      if (popQueue.length === 1) {
        const keyPop = popQueue.pop();
        const comp = {};
        const filterOr = {};

        comp["$gt"] = bounds[keyPop];
        filterOr[keyPop] = comp;
        orList.push(filterOr);
      } else {
        const and = {};
        const filterAnd = [];
        let first = true;

        // Use depth first search to iterate through the keys of the object
        while (popQueue.length) {
          const keyPop = popQueue.pop();
          const comp = {};
          const andOp = {};

          // Add the inequlity operands to the query filter
          if (first)
            comp["$gt"] = bounds[keyPop];
          else
            comp["$eq"] = bounds[keyPop];

          first = false;
          andOp[keyPop] = comp;
          filterAnd.push(andOp);
        }

        // Add the intermediate "$and" operand
        and["$and"] = filterAnd;
        // Add the final "$or operand"
        orList.push(and);
      }
    });

    if (orList.length === 1)
      filter = orList[0];
    else if (orList.length > 1)
      filter["$or"] = orList;

    return filter;
  };

  // Return the pipeline query to extract the n'th element from a chunk with size searchLimit
  // The elements are ordered by the index
  const pipeBounds = function(match, index, searchLimit) {
    const pipeline = [];

    if (index.length) {
      if (!_.isEmpty(match))
        pipeline.push({"$match": match});

      // Get the ascending sort order for the primary indices
      const ascFilter = getSort(index, 1);

      pipeline.push({"$sort": ascFilter});
      pipeline.push({"$limit": searchLimit});


      // Get the descending sort order for the primary indices
      const desFilter = getSort(index, -1);
      pipeline.push({"$sort": desFilter});
      pipeline.push({"$limit": 1});

      // Project only on the set of primary indices
      const project = getProject(index);
      pipeline.push({"$project": project});
    }

    return pipeline;
  };

  // Add the match to the query filter expression
  const addMatch = function(match, indexFilter) {
    if (_.isEmpty(match))
      return indexFilter;

    if (_.isEmpty(indexFilter))
      return match;

    if (!_.isEmpty(match) && !_.isEmpty(indexFilter))
      return {"$and": [match, indexFilter]};

    return {};
  };

  // Transform from:
  // {
  //  "field1$type1": val11,
  //  "field1$type1": val12,
  //  "field2$type1": val21,
  //  "field2$type2": val22
  // }
  // to
  // {
  //  "field1": {
  //    "$type1": val11,
  //    "$type2": val21,
  //  },
  //  "field2": {
  //    "$type1": val21,
  //    "$type2": val22,
  //  },
  // }
  const transformTdxObject = function(tdxObject, typeCount, fields) {
    const retObj = {};

    tdxObject = tdxObject || {};

    if (_.isEmpty(tdxObject))
      retObj[constants.countResultFieldName] = 0;
    else {
      retObj[constants.countResultFieldName] = tdxObject[constants.countFieldName];

      // Assign an array to every field
      if (typeCount) {
        _.forEach(fields, (val) => {
          retObj[val] = new Array(typeCount);
        });
      }
    }

    // Transforms from keys of type "field1$type1" to objects of type {field1: {$type1:...}}
    _.forEach(tdxObject, (resVal, resKey) => {
      const pos = resKey.lastIndexOf("$");

      if (pos > -1) {
        const idx = parseInt(resKey.substring(pos + 1));
        const field = resKey.substring(0, pos);
        retObj[field][idx] = resVal;
      }
    });

    return retObj;
  };

  // Transforms from:
  // {
  //    _id: null,
  //    __count__: val,
  //    "0": val0,
  //    ...: [...],
  //    "n": valn,
  // }
  // to
  // {
  //    count: val,
  //    "bins": [val0,...,valn],
  // }
  const transformBinObject = function(binObject) {
    const bins = [];
    const retObj = {};

    binObject = binObject || {};

    // Add the count field to the resulting object
    if (_.isEmpty(binObject))
      retObj[constants.countResultFieldName] = 0;
    else
      retObj[constants.countResultFieldName] = binObject[constants.countFieldName];

    // Add all the bin values to the bin array
    _.forEach(binObject, (val, key) => {
      if (!isNaN(key)) {
        const idx = parseInt(key);
        if (idx !== NaN)
          bins[idx] = val;
      }
    });

    // Add the bin array to the object
    retObj[constants.binName] = bins;

    return retObj;
  };

  // Replaces every occurrence of the value "$$" with the field "$name"
  // Example:
  // obj = {A:[{B:"$$"}, {C: {D: "$$"}}, {E: [{F: "$$"}]}]}, field = "name"
  // return = {A:[{B:"$name"}, {C: {D: "$name"}}, {E: [{F: "$name"}]}]}
  const replaceField = function(obj, field) {
    if (_.isEmpty(obj))
      return {};

    if (_.isString(field)) {
      if (!field.length)
        return {};

      // First stringify the object
      // Then replace the occurance of "$$"" with a field value
      const strObj = JSON.stringify(obj).replace(new RegExp(constants.fieldKey, "g"), `$${field}`);

      // Return the parsed object
      return JSON.parse(strObj);
    }

    return {};
  };

  // Creates a group object from types = [{key0: expr0}, {key1: expr1}, ...] and fields = [field0, field1, ...]
  // Resulting object:
  // {
  //    "_id": null,
  //    "__count__": {"$sum": 1},
  //    "field0$0": {key0: expr0},
  //    "field0$1": {key1: expr1},
  //    "field1$0": {key0: expr0},
  //    "field1$1": {key1: expr1},
  //    ...
  // }
  const getGroup = function(types, fields) {
    const group = {};

    group["_id"] = null;
    group[constants.countFieldName] = {"$sum": 1};

    _.forEach(fields, (field) => {
      _.forEach(types, (type, idx) => {
        // Replaces the occurences of "$$" with a field
        const newType = replaceField(type, field);
        const typeKeys = _.keys(newType);

        // Adds the key {fieldi$j: {keyj: exprj}} to the final object
        if (typeKeys.length === 1) {
          const obj = {};
          obj[typeKeys[0]] = newType[typeKeys[0]];
          group[`${field}$${idx}`] = obj;
        }
      });
    });

    return group;
  };

  // Returns the group expression for a binIndex and a field
  // For binIndex = {type: "number", low: [0, 1], upp: [1, 2]} and field = "name" Returns
  // "$group": {
  //    "_id": null,
  //    "__count__": ...
  //    "0": {"$sum": {"$cond": [{"$and": [{"$gte": ["$name", 0]},{"$lt": ["$name", 1]}]},1,0]}}
  //    "1": {"$sum": {"$cond": [{"$and": [{"$gte": ["$name", 1]},{"$lte": ["$name", 2]}]},1,0]}}
  // }
  const getBinGroup = function(binIndex, field) {
    const group = {};
    group["_id"] = null;

    // Add the counting operator
    group[constants.countFieldName] = {"$sum": 1};

    _.forEach(binIndex.low, (val, idx) => {
      const and = {};

      // Greater or equal comparison operator
      const gte = {"$gte": [`$${field}`, val]};

      // Less than comparison operator
      const lt = {"$lt": [`$${field}`, binIndex.upp[idx]]};

      // Less than or equal comparison operator
      const lte = {"$lte": [`$${field}`, binIndex.upp[idx]]};

      // Check if it's the last bin
      // The last bound in the bin is closed
      if (idx < binIndex.low.length - 1) {
        and["$and"] = [gte, lt];
      } else
        and["$and"] = [gte, lte];

      // Conditional operator
      const cond = {"$cond": [and, 1, 0]};

      // Summation operator
      const sum = {"$sum": cond};

      // Bin for index idx
      if (field !== "")
        group[`${idx}`] = sum;
    });

    return group;
  };

  // Returns the bounds arrays low and upp using a step size step
  // For left = 1, right = 3 and step = 1
  //  low = [1, 2] and upp = [2, 3]
  const getBinBounds = function(left, right, step) {
    const arr = {low: [], upp: []};

    if (step < 0)
      return arr;

    // Check if the left and rigth bounds are the same
    if (left === right || step === 0) {
      arr.low = [left];
      arr.upp = [right];
      return arr;
    } else if (left > right)
      return arr;

    for (let i = left; i < right; i += step) {
      arr.low.push(i);
      if (i + step < right)
        arr.upp.push(i + step);
      else
        arr.upp.push(right);
    }

    return arr;
  };

  // Return true if a value is numeric
  const isNumeric = function(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
  };

  // Returns a promise with the bin indices given a result = {count: n, field: [m, k]} min/max object
  const getBinIndexPromise = function(result, params) {
    const left = result[params.field][0];
    const right = result[params.field][1];

    if (result.count) {
      // Compute the bin indices
      if (!isNumeric(left) || !isNumeric(right)) {
        const errorNumeric = new Error(constants.numericErrorName);
        errorNumeric.name = `[${left}, ${right}] not a number interval`;
        return Promise.reject(errorNumeric);
      }

      // Get the step size for the bin indices
      const step = (right - left) / params.binIndex["count"];
      const binArr = getBinBounds(left, right, step);
      params.binIndex["low"] = binArr["low"];
      params.binIndex["upp"] = binArr["upp"];
    } else {
      // Return an empty array of bins if no document matches params.match
      params.binIndex["count"] = 0;
      params.binIndex["low"] = [];
      params.binIndex["upp"] = [];
    }

    return Promise.resolve(result.count);
  };

  return ({
    getGroup: getGroup,
    getBinGroup: getBinGroup,
    transform: transformTdxObject,
    transformBin: transformBinObject,
    addMatch: addMatch,
    pipeBounds: pipeBounds,
    computeBounds: computeBounds,
    getBinBounds: getBinBounds,
    getProject: getProject,
    getSort: getSort,
    getInitAccumulator: getInitAccumulator,
    replaceField: replaceField,
    extractFields: extractFields,
    isNumeric: isNumeric,
    getBinIndexPromise: getBinIndexPromise, 
  });
}());

