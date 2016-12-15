module.exports = (function() {
  "use strict";

  const constants = require("./constants");
  const helper = require("./helper-func");
  const DatasetQuery = require("./dataset-query");
  const log = require("debug")("nqm-api-tdx-stats");
  const _ = require("lodash");
  let aggregate = function() {};

  function getBasic(type, datasetId, match, fields, timeout) {
    const pipeline = [];

    match = match || {};
    fields = fields || [];

    if (!_.isEmpty(match))
      pipeline.push({"$match": match});

    if (fields.length)
      pipeline.push({"$group": helper.getGroup(type, fields)});

    log("get %s (%s, %s, %s)", JSON.stringify(type), datasetId, JSON.stringify(pipeline), JSON.stringify(fields));
    return aggregate(datasetId, pipeline, null, timeout)
            .then((val) => {
              const retObj = {};
              retObj[constants.countResultFieldName] = val.data[0][constants.countFieldName];
              _.forEach(val.data[0], (resVal, resKey) => {
                const subObj = {};
                let newKey = "";
                _.forEach(type, (typeVal) => {
                  const pos = resKey.lastIndexOf(typeVal);
                  if (pos > -1) {
                    newKey = resKey.substring(0, pos);
                    subObj[typeVal] = resVal;
                  }
                });
                if (newKey.length)
                  retObj[newKey] = subObj;
              });
              return Promise.resolve(retObj);
            })
            .catch((err) => {
              return Promise.reject(err);
            });
  }

  const getFirstOrder = function(type, datasetId, match, fields, timeout) {
    return getBasic(type, datasetId, match, fields, timeout);
  };

  function FirstOrderAPI(tdxApi, authFunc) {
    aggregate = new DatasetQuery(tdxApi, authFunc).aggregate;

    this.getFirstOrder = getFirstOrder;
  }

  return FirstOrderAPI;
}());
