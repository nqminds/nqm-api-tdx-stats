module.exports = (function() {
  "use strict";

  const Promise = require("bluebird");
  const _ = require("lodash");
  const helper = require("./helper-func");
  const FirstOrderApi = require("./first-order");
  const ChunkIterator = require("./chunk-iterator");
  const DatasetQuery = require("./dataset-query");
  const constants = require("./constants");

  let aggregate = function() {};
  let getBasic = function() {};
  let api;

  // Basic call iterator function for for an empty set of indices
  const baseCallFunction = function(changeOutput) {
    return getBasic(this._funcParams.type, this._funcParams.datasetId,
                          this._funcParams.match, this._funcParams.fields,
                          [], 0, this._funcParams.timeout)
            .then((val) => {
              this._internalParams.iterationNumber++;
              this._done = true;
              return Promise.resolve(val);
            });
  };

  // Basic change iterator function for an empty set of indices
  const baseChangeFunction = function() {
    return Promise.resolve({});
  };

  // Iterator call function for a nonempty set of indices
  const indexCallFunction = function(changeOutput) {
    // Check if no iteration required (index error)
    // Set the this._done flag to true and return an empty object
    if (!this._internalParams.totalIterations) {
      const obj = {};
      obj[constants.countResultFieldName] = this._internalParams.totalCount;
      this._done = true;
      return Promise.resolve(obj);
    }

    return getBasic(this._funcParams.type, this._funcParams.datasetId, changeOutput.match,
                    this._funcParams.fields, this._funcParams.index, changeOutput.limit, this._funcParams.timeout)
            .then((val) => {
              this._internalParams.iterationNumber++;

              // Check if total iterations reached
              if (this._internalParams.iterationNumber >= this._internalParams.totalIterations)
                this._done = true;

              return Promise.resolve(val);
            });
  };

  const indexChangeFunction = function() {
    let match = _.clone(this._internalParams.matchFilter);
    const limit = this._internalParams.chunkSize;

    // Set the calling function match parameter
    if (_.isEmpty(this._internalParams.matchFilter))
      match = this._funcParams.match;

    // Add the index query bound to the match filter
    const pipeline = helper.pipeBounds(match, this._funcParams.index, limit);

    if (!this._internalParams.totalIterations)
      return Promise.resolve({});

    // Find the index query bound
    return aggregate(this._funcParams.datasetId, pipeline, null, this._funcParams.timeout)
            .then((val) => {
              const keys = _.map(val.data[0], (val, key) => (key));
              const diffKeys = _.difference(this._funcParams.index, keys);

              // Check the existance of the set of primary indices
              if (diffKeys.length) {
                const error = new Error(constants.indexErrorName);
                error.name = `Wrong primary index: ${diffKeys}`;

                this._internalParams.totalIterations = 0;
                this._done = true;
                return Promise.reject(error);
              }

              // Extract the query bounds for the primary indices
              // Add the query bounds to the match filter
              this._internalParams.matchFilter =
                helper.addMatch(this._funcParams.match,
                helper.computeBounds(_.pick(val.data[0], this._funcParams.index)));
              return Promise.resolve({match: match, limit: limit});
            });
  };

  function getIterator(type, datasetId, match, fields, index, chunkSize, timeout) {
    let size = chunkSize;

    const funcParams = {type: type, datasetId: datasetId, match: match, fields: fields, index: index, timeout: timeout};
    let iterator;

    // Create a new iterator object
    if (!index.length || !size)
      iterator = new ChunkIterator(baseCallFunction, funcParams, baseChangeFunction);
    else
      iterator = new ChunkIterator(indexCallFunction, funcParams, indexChangeFunction);

    // Retrieve the number of documents matching the match parameter
    return api.getDatasetDataCountAsync(datasetId, match)
              .then((val) => {
                let iterations = 0;

                if (val.count < size)
                  size = val.count;

                // Compute the number of iterations based on the number of documents
                if (type.length && size && val.count)
                  iterations = parseInt(Math.floor(val.count / size) + ((val.count % size) ? 1 : 0));
                else if (!size && val.count)
                  iterations = 1;

                // Set the internal parameters used in the ChunkIterator object
                iterator.setInternalParam("totalCount", val.count);
                iterator.setInternalParam("totalIterations", iterations);
                iterator.setInternalParam("iterationNumber", 0);
                iterator.setInternalParam("matchFilter", {});
                iterator.setInternalParam("chunkSize", size);

                // Return a ChunkIterator object
                return Promise.resolve(iterator);
              });
  }

  const getFirstOrderIterator = function(datasetId, params) {
    const type = params.type || [];
    const match = params.match || {};
    const fields = params.fields || [];
    const index = params.index || [];

    let size;
    if (params.chunkSize === undefined)
      size = constants.chunkSize;
    else
      size = params.chunkSize;

    const timeout = params.timeout || 0;

    return getIterator(type, datasetId, match, fields, index, size, timeout);
  };

  // Return the value for a given type
  // Uses the init as the initial accumulator
  // and cf(input, output, iterator) as the calling function
  const getFirstOrderChunk = function(datasetId, params, cf, init) {
    init = init || {};

    if (typeof params === "function") {
      cf = params;
      params = undefined;
    }

    if (typeof cf !== "function") {
      const error = new Error(constants.funcErrorName);
      error.name = "Wrong function argument";
      return Promise.reject(error);
    }

    // Loop through iterations
    return getFirstOrderIterator(datasetId, params)
            .then((iterator) => {
              if (iterator.getInternalParam("totalIterations")) {
                const iterList = Array.from(new Array(iterator.getInternalParam("totalIterations")), (val, index) => index + 1);
                // Execute every iteration sequentially
                return Promise.reduce(iterList, (output) => {
                  // Retrieve the value of the current iteration
                  return iterator.next().then((val) => {
                    // Execute the calling function with output as the current accumulator
                    return cf(val, output, iterator);
                  });
                }, init);
              } else
                return iterator.next();
            })
          .then((output) => {
            return Promise.resolve(output);
          });
  };

  const getMinChunk = function(datasetId, params, cf) {
    if (typeof params === "function") {
      cf = params;
      params = undefined;
    }

    params = params || {};
    params.fields = params.fields || [];

    // Set the type to {"$min": constants.fieldStrKey}, only interested in minimum
    params.type = [{"$min": constants.fieldStrKey}];

    // Retrieve the initial accumulator for the give type
    const init = helper.getInitAccumulator(params.fields, params.type);

    // Calling function definition
    const processChunk = function(input, output, iterator) {
      output[constants.countResultFieldName] += input[constants.countResultFieldName];

      // Compute the minimum chunk by chunk
      _.forEach(params.fields, (field) => {
        output[field][0] = Math.min(output[field][0], input[field][0]);
      });

      // Execute user defined calling function
      if (typeof cf === "function")
        cf(iterator);
      return output;
    };

    return getFirstOrderChunk(datasetId, params, processChunk, init);
  };

  const getMaxChunk = function(datasetId, params, cf) {
    if (typeof params === "function") {
      cf = params;
      params = undefined;
    }

    params = params || {};
    params.fields = params.fields || [];

    // Set the type to {"$max": constants.fieldStrKey}, only interested in maximum
    params.type = [{"$max": constants.fieldStrKey}];

    const init = helper.getInitAccumulator(params.fields, params.type);
    const processChunk = function(input, output, iterator) {
      output[constants.countResultFieldName] += input[constants.countResultFieldName];

      // Compute maximum chunk by chunk
      _.forEach(params.fields, (field) => {
        output[field][0] = Math.max(output[field][0], input[field][0]);
      });

      if (typeof cf === "function")
        cf(iterator);
      return output;
    };

    return getFirstOrderChunk(datasetId, params, processChunk, init);
  };

  const getSumChunk = function(datasetId, params, cf) {
    if (typeof params === "function") {
      cf = params;
      params = undefined;
    }

    params = params || {};
    params.fields = params.fields || [];

    // Set the type to {"$sum": constants.fieldStrKey}, only interested in sum
    params.type = [{"$sum": constants.fieldStrKey}];

    const init = helper.getInitAccumulator(params.fields, params.type);
    const processChunk = function(input, output, iterator) {
      output[constants.countResultFieldName] += input[constants.countResultFieldName];

      // Compute the sum chunk by chunk
      // Sum is additive
      _.forEach(params.fields, (field) => {
        output[field][0] += input[field][0];
      });

      if (typeof cf === "function")
        cf(iterator);
      return output;
    };

    return getFirstOrderChunk(datasetId, params, processChunk, init);
  };

  const getAvgChunk = function(datasetId, params, cf) {
    // Use the sum function to compute the average
    // Average is additive
    return getSumChunk(datasetId, params, cf)
            .then((output) => {
              params.type = [{"$avg": constants.fieldStrKey}];

              let avgOutput = helper.getInitAccumulator(params.fields, params.type);
              avgOutput[constants.countResultFieldName] = output[constants.countResultFieldName];

              // Get the overall average from the sum
              if (output.count) {
                _.forEach(params.fields, (field) => {
                  avgOutput[field][0] = output[field][0] / output.count;
                });
              } else avgOutput = output;

              return Promise.resolve(avgOutput);
            });
  };

  const getStdChunk = function(datasetId, params, cf) {
    if (typeof params === "function") {
      cf = params;
      params = undefined;
    }

    params = params || {};
    params.fields = params.fields || [];

    // Set the type to {"$sum": constants.fieldStrKey} and {"$sum": {"$pow": [constants.fieldStrKey, 2]}}
    // Only interested in sumation and the sumation of the square root
    params.type = [{"$sum": constants.fieldStrKey}, {"$sum": {"$pow": [constants.fieldStrKey, 2]}}];

    const init = helper.getInitAccumulator(params.fields, params.type);

    const processChunk = function(input, output, iterator) {
      output.count += input.count;
      // Accumulate the sum and the sum of square roots
      _.forEach(params.fields, (field) => {
        output[field][0] += input[field][0];
        output[field][1] += input[field][1];
      });

      if (typeof cf === "function")
        cf(iterator);
      return output;
    };

    return getFirstOrderChunk(datasetId, params, processChunk, init)
            .then((output) => {
              const outObj = {};
              outObj[constants.countResultFieldName] = output[constants.countResultFieldName];
              const count = output[constants.countResultFieldName];
              // The standard deviation is additive
              _.forEach(params.fields, (field) => {
                // Compute the population or the sample distributions
                // Population: (1/N)*(sum_1^Nx_i*x_i)-x_avg^2
                // Sample: (1/(N-1))(*(sum_1^Nx_i*x_i)-N*x_avg^2)
                // sum_1^Nx_i*x_i and x_avg already computed by getFirstOrderChunk
                if (constants.stdPopulaton === params.distribution)
                  outObj[field] = [Math.sqrt((output[field][1] / count) - Math.pow(output[field][0] / count, 2))];
                else if (constants.stdSample === params.distribution) {
                  const sqravg = count * Math.pow(output[field][0] / count, 2);
                  outObj[field] = [Math.sqrt((output[field][1] - sqravg) / (count - 1))];
                }
              });
              return Promise.resolve(outObj);
            });
  };

  function FirstOrderChunkAPI(tdxApi, authFunc) {
    api = tdxApi;

    getBasic = new FirstOrderApi(tdxApi, authFunc).getBasic;
    aggregate = new DatasetQuery(tdxApi, authFunc).aggregate;

    this.getFirstOrderIterator = getFirstOrderIterator;
    this.getFirstOrderChunk = getFirstOrderChunk;
    this.getMinChunk = getMinChunk;
    this.getMaxChunk = getMaxChunk;
    this.getSumChunk = getSumChunk;
    this.getAvgChunk = getAvgChunk;
    this.getStdChunk = getStdChunk;
  }

  return FirstOrderChunkAPI;
}());
