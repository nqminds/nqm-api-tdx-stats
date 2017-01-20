module.exports = (function() {
  "use strict";

  const constants = require("./constants");
  const _ = require("lodash");

  // Extract the fields of type "$name" from an type
  // Example type = {"$min": "$name"}
  // Return: ["$name"]
  const extractFields = function(type, fields) {
    const newFields = [];
    const queue = [];

    _.forEach(_.values(type), (item) => queue.push(item));

    while (queue.length) {
      const val = queue.pop();

      if (_.isString(val)) {
        if (val.length) {
          const nval = val[0] === "$" ? val.substring(1) : val;
          if (val !== constants.fieldStrKey && constants.mongoDbExpr.indexOf(val) < 0 &&
              fields.indexOf(nval) < 0)
            newFields.push(nval);
        }
      } else if (_.isObject(val))
        _.forEach(_.values(val), (item) => queue.push(item));
    }

    return newFields;
  };

  // Returns the object {count: 0, field1: [0], field2: [0], ...}
  const getInitAccumulator = function(fields, type) {
    const init = {};
    init[constants.countResultFieldName] = 0;
    const keys = _.keys(type);
    _.forEach(fields, (field) => {
      if (keys[0] === "$min")
        init[field] = [Infinity];
      else
        init[field] = [0];
    });

    return init;
  };

  // Return the object {field1: 1, field2: 1, ...} from fields = [field1, field2, ...]
  const getProject = function(fields) {
    const project = {};
    _.forEach(fields, (key) => {
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

        while (popQueue.length) {
          const keyPop = popQueue.pop();
          const comp = {};
          const andOp = {};

          if (first)
            comp["$gt"] = bounds[keyPop];
          else
            comp["$eq"] = bounds[keyPop];

          first = false;
          andOp[keyPop] = comp;
          filterAnd.push(andOp);
        }

        and["$and"] = filterAnd;
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

      const ascFilter = getSort(index, 1);

      pipeline.push({"$sort": ascFilter});
      pipeline.push({"$limit": searchLimit});

      const desFilter = getSort(index, -1);
      pipeline.push({"$sort": desFilter});
      pipeline.push({"$limit": 1});

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

      // Assign empty object to every key in the field
      if (typeCount) {
        _.forEach(fields, (val) => {
          retObj[val] = new Array(typeCount);
        });
      }
    }

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

      const strObj = JSON.stringify(obj).replace(new RegExp(constants.fieldKey, "g"), `$${field}`);
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
        const newType = replaceField(type, field);
        const typeKeys = _.keys(newType);

        if (typeKeys.length === 1) {
          const obj = {};
          obj[typeKeys[0]] = newType[typeKeys[0]];
          group[`${field}$${idx}`] = obj;
        }
      });
    });

    return group;
  };

  return ({
    getGroup: getGroup,
    transform: transformTdxObject,
    addMatch: addMatch,
    pipeBounds: pipeBounds,
    computeBounds: computeBounds,
    getProject: getProject,
    getSort: getSort,
    getInitAccumulator: getInitAccumulator,
    replaceField: replaceField,
    extractFields: extractFields,
  });
}());
