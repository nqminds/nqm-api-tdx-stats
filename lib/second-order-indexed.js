module.exports = (function() {
  "use strict";

  const FirstOrderIndexedApi = require("./first-order-indexed");
  const Promise = require("bluebird");
  const constants = require("./constants");
  const helper = require("./helper-func");

  let api;
  let getMinIndexed = function() {};
  let getMaxIndexed = function() {};

  // Iterate over the binIndex bounds and return the histogram
  function binIterator(datasetId, params) {
    return Promise.reduce(params.binIndex.low, (output, bound, idx) => {
      const boundObj = {};
      const gte = {};
      const lt = {};
      const lte = {};

      // Define the index bounds for the query
      gte[params.field] = {"$gte": params.binIndex.low[idx]};
      lt[params.field] = {"$lt": params.binIndex.upp[idx]};
      lte[params.field] = {"$lte": params.binIndex.upp[idx]};

      // Add the lower and upper bounds
      // The last element of the binIndex has closed bounds
      if (idx < params.binIndex.low.length - 1)
        boundObj["$and"] = [gte, lt];
      else
        boundObj["$and"] = [gte, lte];

      return api.getDatasetDataCountAsync(datasetId, helper.addMatch(params.match, boundObj))
        .then((result) => {
          // Add the frequency to the array
          output.push(result.count);
          return Promise.resolve(output);
        });
    }, []);
  }
  const getHistogramIndexed = function(datasetId, params) {
    const minmaxObj = {count: 0};
    const retObj = {};
    let retPromise = Promise.resolve({});

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

    // Get the min, max and compute the bin indices
    if (!params.binIndex.low.length && params.binIndex["count"]) {
      retPromise = getMinIndexed(datasetId, params)
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
          return helper.getBinIndexPromise(minmaxObj, params);
        });
    } else if (params.binIndex.low.length && !params.binIndex["count"]) {
      // Get only the count for the params.match
      retPromise = api.getDatasetDataCountAsync(datasetId, params.match)
        .then((result) => {
          params.binIndex["count"] = params.binIndex.low.length;
          minmaxObj.count = result.count;
          return Promise.resolve(minmaxObj);
        });
    }

    return retPromise.then((result) => {
      // Prepare the return object, add the count
      retObj[constants.countResultFieldName] = result.count;
      return binIterator(datasetId, params);
    }).then((bins) => {
      // Add the bins and the binIndex to the return object
      retObj[constants.binName] = bins;
      retObj.binIndex = params.binIndex;
      return Promise.resolve(retObj);
    });
  };

  function SecondOrderIndexedAPI(tdxApi) {
    api = tdxApi;

    const foIndexed = new FirstOrderIndexedApi(tdxApi);
    getMinIndexed = foIndexed.getMinIndexed;
    getMaxIndexed = foIndexed.getMaxIndexed;

    this.getHistogramIndexed = getHistogramIndexed;
  }

  return SecondOrderIndexedAPI;
}());
