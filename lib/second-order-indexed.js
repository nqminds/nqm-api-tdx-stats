module.exports = (function() {
  "use strict";

  const FirstOrderIndexedApi = require("./first-order-indexed");
  const Promise = require("bluebird");
  const constants = require("./constants");

  let getMinIndexed = function() {};
  let getMaxIndexed = function() {};

  const getHistogramIndexed = function(datasetId, params) {
    const minmaxObj = {count: 0};
    params.match = params.match || {};
    params.field = params.field || "";
    params.timeout = params.timeout || 0;
    params.binIndex = params.binIndex || {};

    // Assign the default bin type to "number"
    params.binIndex["type"] = params.binIndex["type"] || constants.binTypes[0];
    params.binIndex["low"] = params.binIndex["low"] || [];
    params.binIndex["upp"] = params.binIndex["upp"] || [];
    params.binIndex["count"] = params.binIndex["count"] || 0;

    // Return error if wrong bin index lengths
    const error = new Error(constants.binLenErrorName);
    if (params.binIndex.low.length !== params.binIndex.upp.length) {
      error.name = `Wrong bin index lengths low: ${params.binIndex.low.length}, upp: ${params.binIndex.upp.length}`;
      return Promise.reject(error);
    } else {
      if (params.binIndex.low.length !== params.binIndex["count"] &&
         params.binIndex["count"] && params.binIndex.low.length) {
        error.name = `Wrong bin index length: ${params.binIndex.low.length} and count: ${params.binIndex["count"]}`;
        return Promise.reject(error);
      }
    }

    return getMinIndexed(datasetId, params)
      .then((resultMin) => {
        minmaxObj.count = resultMin[constants.countResultFieldName];
        minmaxObj[params.field] = [];
        minmaxObj[params.field].push(resultMin[params.field][0]);
        // Set params.getcount to false as we already have the count from the min call
        params.getcount = false;

        return getMaxIndexed(datasetId, params);
      })
      .then((resultMax) => {
        minmaxObj[params.field].push(resultMax[params.field][0]);
      });
  };

  function SecondOrderIndexedAPI(tdxApi) {
    const foIndexed = new FirstOrderIndexedApi(tdxApi);
    getMinIndexed = foIndexed.getMinIndexed;
    getMaxIndexed = foIndexed.getMaxIndexed;

    this.getHistogramIndexed = getHistogramIndexed;
  }

  return SecondOrderIndexedAPI;
}());
