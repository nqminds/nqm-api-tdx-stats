module.exports = (function() {
  "use strict";

  const constants = require("./constants");
  const _ = require("lodash");

  // Returns the object {count: 0, field1: {type: 0}, field2: {type: 0}, ...}
  const getInitAccumulator = function(fields, type) {
    const init = {};
    init[exports.countResultFieldName] = 0;
    _.forEach(fields, (field) => {
      const obj = {};
      obj[type] = 0;
      if (type === "$min")
        obj[type] = Infinity;
      init[field] = obj;
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
  const transformTdxObject = function(tdxObject, type, fields) {
    const retObj = {};

    tdxObject = tdxObject || {};

    if (_.isEmpty(tdxObject))
      retObj[constants.countResultFieldName] = 0;
    else {
      retObj[constants.countResultFieldName] = tdxObject[constants.countFieldName];

      // Assign empty object to every key in the field
      if (type.length) {
        _.forEach(fields, (val) => {
          retObj[val] = {};
        });
      }
    }

    _.forEach(tdxObject, (resVal, resKey) => {
      let newKey = "";
      _.forEach(type, (typeVal) => {
        const pos = resKey.lastIndexOf(typeVal);
        if (pos > -1) {
          newKey = resKey.substring(0, pos);
          retObj[newKey][typeVal] = resVal;
        }
      });
    });

    return retObj;
  };

  // Creates a group object from type = [type1, type2, ...] and fields = [fields1, fields2, ...]
  // Resulting object:
  // {
  //    "_id": null,
  //    "__count__": {"$sum": 1},
  //    "field1type1": {"type1": "field1"},
  //    "field1type2": {"type2": "field1"},
  //    "field2type1": {"type1": "field2"},
  //    "field2type2": {"type2": "field2"},
  //    ...
  // }
  const getGroup = function(type, fields) {
    const group = {};

    group["_id"] = null;
    group[constants.countFieldName] = {"$sum": 1};
    _.forEach(fields, (fieldName) => {
      _.forEach(type, (typeName) => {
        const obj = {};
        obj[typeName] = `$${fieldName}`;
        group[fieldName + typeName] = obj;
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
  });
}());
