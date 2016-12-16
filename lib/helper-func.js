module.exports = (function() {
  "use strict";

  const constants = require("./constants");
  const _ = require("lodash");

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
  });
}());
