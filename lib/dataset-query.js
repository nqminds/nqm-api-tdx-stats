module.exports = (function() {
  "use strict";

  const constants = require("./constants");

  let api;
  let authenticate;

  function aggregateBasic(datasetId, pipeline, options, timeout) {
    const race = [];

    timeout = timeout || 0;

    const timePromise =
      new Promise((resolve, reject) => {
        const error = new Error(constants.timeoutErrorName);
        error.name = constants.aggregateErrorName;
        setTimeout(() => (reject(error)), timeout);
      });

    const aggregatePromise = api.getAggregateDataAsync(datasetId, JSON.stringify(pipeline), options);
    race.push(timePromise);
    race.push(aggregatePromise);

    if (timeout)
      return Promise.race(race);
    else
      return aggregatePromise;
  }

  const aggregate = function(datasetId, pipeline, options, timeout) {
    return authenticate().then(() => {
      return aggregateBasic(datasetId, pipeline, options, timeout);
    });
  };

  function DatasetQuery(tdxApi, authFunc) {
    api = tdxApi;
    authenticate = authFunc;
    this.aggregate = aggregate;
  }

  return DatasetQuery;
}());
