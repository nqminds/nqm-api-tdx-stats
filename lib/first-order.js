module.exports = (function() {
  "use strict";

  const constants = require("./constants");

  const log = require("debug")("nqm-api-tdx-stats");
  const _ = require("lodash");

  function auth(cb) {
    return this.authenticate().then(() => (cb()));
  }

  function aggregate(datasetId, pipeline, options, timeout) {
    const race = [];

    timeout = timeout || 0;

    const timePromise =
      new Promise((resolve, reject) => {
        setTimeout(() => (reject(new Error("Aggregate timeout"))), timeout);
      });

    const aggregatePromise = this.tdxApi.getAggregateDataAsync(datasetId, JSON.stringify(pipeline), options);
    race.push(timePromise);
    race.push(aggregatePromise);

    if (timeout)
      return Promise.race(race);
    else
      return aggregatePromise;
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

  const getMin = function(datasetId, match, fields, timeout) {
    const pipeline = [];

    match = match || {};
    fields = fields || [];

    if (!_.isEmpty(match))
      pipeline.push({"$match": match});

    if (fields.length)
      pipeline.push({"$group": getGroup(["$min"], fields)});

    log("getMin(%s, %s, %s)", datasetId, JSON.stringify(pipeline), JSON.stringify(fields));
    return auth.call(this, () => (aggregate.call(this, datasetId, pipeline, null, timeout)));
  };

  const getMax = function(datasetId, match, fields) {

  };

  const getAverage = function(datasetId, match, fields) {

  };

  function FirstOrderAPI() {
    this.getMin = getMin.bind(this);
    this.getMax = getMax.bind(this);
    this.getAverage = getAverage.bind(this);
  }

  return FirstOrderAPI;
}());
