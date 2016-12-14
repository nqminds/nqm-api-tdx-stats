module.exports = (function() {
  "use strict";

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
    return aggregate(datasetId, pipeline, null, timeout);
  }

  const getMin = function(datasetId, match, fields, timeout) {
    return getBasic(["$min"], datasetId, match, fields, timeout);
  };

  const getMax = function(datasetId, match, fields, timeout) {
    return getBasic(["$max"], datasetId, match, fields, timeout);
  };

  const getAverage = function(datasetId, match, fields, timeout) {
    return getBasic(["$avg"], datasetId, match, fields, timeout);
  };

  function FirstOrderAPI(tdxApi, authFunc) {
    aggregate = new DatasetQuery(tdxApi, authFunc).aggregate;

    this.getMin = getMin;
    this.getMax = getMax;
    this.getAverage = getAverage;
  }

  return FirstOrderAPI;
}());
