module.exports = (function() {
  "use strict";

  const constants = require("./constants");

  let api;
  let authenticate;

  function aggregateBasic(datasetId, pipeline, options, timeout) {
    const error = new Error(constants.timeoutErrorName);
    error.name = constants.aggregateErrorName;

    timeout = timeout || 0;

    return api.getAggregateDataAsync(datasetId, JSON.stringify(pipeline), options).timeout(timeout, error);
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
