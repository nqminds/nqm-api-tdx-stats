module.exports = (function() {
  "use strict";

  const constants = require("./constants");
  const _ = require("lodash");

  // Return the pipeline query to extract the n'th element from a chunk with size searchLimit
  // The elements are ordered by the index
  const pipeBounds = function(index, searchLimit) {
    const pipeline = [];
    const ascFilter = {};

    _.forEach(index, (key) => {
      ascFilter[key] = 1;
    });

    pipeline.push({"$sort": ascFilter});
    pipeline.push({"$limit": searchLimit});

    const desFilter = {};
    _.forEach(index, (key) => {
      desFilter[key] = -1;
    });

    pipeline.push({"$sort": desFilter});
    pipeline.push({"$limit": 1});
    pipeline.push({"$project": ascFilter});

    return pipeline;
  };

  // Checks if any key from index is present in match
  // Removes the corresponding key from match
  const filterMatch = function(match, index) {
    const matchFiltered = {};
    _.forEach(match, (val, key) => {
      if (index.indexOf(key) < 0)
        matchFiltered[key] = val;
    });
    return matchFiltered;
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
    retObj[constants.countResultFieldName] = tdxObject[constants.countFieldName];

    // Assign empty object to every key in the field
    _.forEach(fields, (val) => {
      retObj[val] = {};
    });

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
    filterMatch: filterMatch,
    pipeBounds: pipeBounds,
  });
}());
