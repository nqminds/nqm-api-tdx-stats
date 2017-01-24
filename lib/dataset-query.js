module.exports = (function() {
  "use strict";

  const constants = require("./constants");

  let api;
  let authenticate;

  // Use the tdx-api fro agreggation
  function aggregateBasic(datasetId, pipeline, options, timeout) {
    const error = new Error(constants.timeoutErrorName);
    error.name = constants.aggregateErrorName;

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
