module.exports = (function() {
  "use strict";

  const constants = require("./constants");

  const log = require("debug")("nqm-api-tdx-stats");
  const _ = require("lodash");

  function auth(cb) {
    return this.authenticate().then(() => (cb()));
  }

  function aggregate(datasetId, pipeline, options) {
    return this.tdxApi.getAggregateDataAsync(datasetId, JSON.stringify(pipeline), options);
  }

  function getGroup(type, fields) {
    const group = {};

    if (type.length === 1) {
      group["_id"] = null;
      group[constants.countFieldName] = {"$sum": 1};
      _.forEach(fields, (val) => {
        group[val] = {"$min": `$${val}`};
      });
    }

    return group;
  }

  const getMin = function(datasetId, filter, fields) {
    const options = null;
    const pipeline = [{
      "$group": getGroup(["$min"], fields),
    }];

    log("getMin(%s, %s, %s)", datasetId, JSON.stringify(pipeline), JSON.stringify(fields));
    return auth.call(this, () => (aggregate.call(this, datasetId, pipeline, options)));
  };

  const getMax = function(datasetId, filter, fields) {

  };

  const getAverage = function(datasetId, filter, fields) {

  };

  function FirstOrderAPI() {
    this.getMin = getMin.bind(this);
    this.getMax = getMax.bind(this);
    this.getAverage = getAverage.bind(this);
  }

  return FirstOrderAPI;
}());
