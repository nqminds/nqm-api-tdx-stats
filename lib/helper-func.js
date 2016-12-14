module.exports = (function() {
  const constants = require("./constants");
  const _ = require("lodash");

  const getGroup = function(type, fields) {
    const group = {};

    // if (type.length === 1) {
    group["_id"] = null;
    group[constants.countFieldName] = {"$sum": 1};
    _.forEach(fields, (fieldName) => {
      _.forEach(type, (typeName) => {
        const obj = {};
        obj[typeName] = `$${fieldName}`;
        group[fieldName + typeName] = obj;
      });
      //obj[type[0]] = `$${val}`;
      //group[val] = obj;
    });
    //}

    return group;
  };

  return ({
    getGroup: getGroup,
  });
}());
