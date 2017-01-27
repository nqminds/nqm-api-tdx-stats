module.exports = (function() {
  "use strict";

  const _ = require("lodash");
  const Promise = require("bluebird");
  const ChunkCommon = require("./chunk-common");
  const SecondOrderApi = require("./second-order");
  const FirstOrderChunkApi = require("./first-order-chunk");
  const constants = require("./constants");
  const helper = require("./helper-func");

  let auth = function() {};
  let api;

  // Iterates over all chunks and accumulates all histogram values
  const iterateHistogramChunks = function(datasetId, params, cf) {
    const getChunkIterator = new ChunkCommon(api, auth).getChunkIterator;
    const getBasicBins = new SecondOrderApi(api, auth).getBasicBins;

    const processHistogram = function(input, output, iterator) {
      output[constants.countResultFieldName] += input[constants.countResultFieldName];
      // Add all the histrogram values
      _.forEach(input.bins, (val, idx) => {
        output.bins[idx] += val;
      });
      cf();
      return output;
    };

    return getChunkIterator({datasetId: datasetId, params: params}, getBasicBins)
            .then((iterator) => {
              // Initial value of the accumulators
              const init = {
                count: 0,
                bins: _.fill(Array(params.binIndex.low.length), 0), // Fill bin array with zeros
                binIndex: params.binIndex,
              };
              if (iterator.getInternalParam("totalIterations")) {
                const iterList = Array.from(new Array(iterator.getInternalParam("totalIterations")), (val, index) => index + 1);
                // Execute every iteration sequentially
                return Promise.reduce(iterList, (output) => {
                  // Retrieve the value of the current iteration
                  return iterator.next().then((val) => {
                    // Execute the calling function with output as the current accumulator
                    return processHistogram(val, output, iterator);
                  });
                }, init);
              } else
                return iterator.next();
            })
          .then((output) => {
            return Promise.resolve(output);
          });
  };

  const getHistogramChunk = function(datasetId, params, cf) {
    cf = cf || function() {};

    params.match = params.match || {};
    params.field = params.field || "";
    params.types = [{"$min": constants.fieldStrKey}, {"$max": constants.fieldStrKey}];
    params.fields = [params.field];
    params.binIndex = params.binIndex || {};

    // Assign the default bin type to "number"
    params.binIndex["type"] = params.binIndex["type"] || constants.binTypes[0];
    params.binIndex["low"] = params.binIndex["low"] || [];
    params.binIndex["upp"] = params.binIndex["upp"] || [];
    params.binIndex["count"] = params.binIndex["count"] || 0;
    params.index = params.index || [];
    params.limit = params.limit || 0;
    params.chunkSize = params.chunkSize || constants.chunkSize;
    params.timeout = params.timeout || 0;

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

    const getFirstOrderChunk = new FirstOrderChunkApi(api, auth).getFirstOrderChunk;

    // Assign a non-zero value as the count fo Promise
    let retPromise = Promise.resolve(1);

    if (!params.binIndex.low.length && params.binIndex["count"]) {
      // Retrieve the initial accumulator for the min and max types
      const init = helper.getInitAccumulator([params.field], params.types);

      // Calling function to find the min and max for params.field
      const processMinMax = function(input, output, iterator) {
        const field = iterator.getFuncParam("params")["field"];
        output[constants.countResultFieldName] += input[constants.countResultFieldName];
        output[field][0] = Math.min(output[field][0], input[field][0]);
        output[field][1] = Math.max(output[field][1], input[field][1]);
        cf(iterator);
        return output;
      };

      // Return the binIndex object from min/max for the field params.field
      retPromise = getFirstOrderChunk(datasetId, params, processMinMax, init)
                    .then((result) => (helper.getBinIndexPromise(result, params)));
    } else if (params.binIndex.low.length && !params.binIndex["count"])
      params.binIndex["count"] = params.binIndex.low.length;

    return retPromise.then((count) => {
      if (count) {
        return iterateHistogramChunks(datasetId, params, cf);
      } else {
        const retObj = {
          count: 0,
          bins: [],
          binIndex: params.binIndex,
        };
        return Promise.resolve(retObj);
      }
    });
  };

  function SecondOrderChunkAPI(tdxApi, authFunc) {
    api = tdxApi;
    auth = authFunc;

    this.getHistogramChunk = getHistogramChunk;
  }

  return SecondOrderChunkAPI;
}());
