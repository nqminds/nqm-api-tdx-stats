module.exports = (function() {
  "use strict";

  const helper = require("./helper-func");
  const DatasetQuery = require("./dataset-query");
  const log = require("debug")("nqm-api-tdx-stats");
  const _ = require("lodash");
  let auth = function() {};
  let aggregate = function() {};

  const getMin = function(datasetId, match, fields, timeout) {
    const pipeline = [];
    
    match = match || {};
    fields = fields || [];

    if (!_.isEmpty(match))
      pipeline.push({"$match": match});

    if (fields.length)
      pipeline.push({"$group": helper.getGroup(["$min"], fields)});

    log("getMin(%s, %s, %s)", datasetId, JSON.stringify(pipeline), JSON.stringify(fields));
    return auth(() => (aggregate(datasetId, pipeline, null, timeout)));
  };

  const getMax = function(datasetId, match, fields, timeout) {
    const pipeline = [];

    match = match || {};
    fields = fields || [];

    if (!_.isEmpty(match))
      pipeline.push({"$match": match});

    if (fields.length)
      pipeline.push({"$group": helper.getGroup(["$max"], fields)});

    log("getMax(%s, %s, %s)", datasetId, JSON.stringify(pipeline), JSON.stringify(fields));
    return auth(() => (aggregate(datasetId, pipeline, null, timeout)));
  };

  const getAverage = function(datasetId, match, fields, timeout) {
    const pipeline = [];

    match = match || {};
    fields = fields || [];

    if (!_.isEmpty(match))
      pipeline.push({"$match": match});

    if (fields.length)
      pipeline.push({"$group": helper.getGroup(["$avg"], fields)});

    log("getAverage(%s, %s, %s)", datasetId, JSON.stringify(pipeline), JSON.stringify(fields));
    return auth(() => (aggregate(datasetId, pipeline, null, timeout)));
  };

  function FirstOrderAPI(tdxApi, authFunc) {
    auth = authFunc;
    aggregate = new DatasetQuery(tdxApi).aggregate;

    this.getMin = getMin;
    this.getMax = getMax;
    this.getAverage = getAverage;
  }

  return FirstOrderAPI;
}());
