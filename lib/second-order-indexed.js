module.exports = (function() {
  "use strict";

  const Promise = require("bluebird");

  let api;

  const getHistogramIndexed = function(datasetId, params) {
      return null;
  };

  function SecondOrderIndexedAPI(tdxApi) {
    api = tdxApi;

    this.getHistogramIndexed = getHistogramIndexed;
  }

  return SecondOrderIndexedAPI;
}());
