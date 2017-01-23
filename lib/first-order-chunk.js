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

  const baseChangeFunction = function() {
    return Promise.resolve({});
  };

  const indexCallFunction = function(changeOutput) {
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

              if (this._internalParams.iterationNumber >= this._internalParams.totalIterations)
                this._done = true;

              return Promise.resolve(val);
            });
  };

  const indexChangeFunction = function() {
    let match = _.clone(this._internalParams.matchFilter);
    const limit = this._internalParams.chunkSize;

    if (_.isEmpty(this._internalParams.matchFilter))
      match = this._funcParams.match;

    const pipeline = helper.pipeBounds(match, this._funcParams.index, limit);

    if (!this._internalParams.totalIterations)
      return Promise.resolve({});

    return aggregate(this._funcParams.datasetId, pipeline, null, this._funcParams.timeout)
            .then((val) => {
              const keys = _.map(val.data[0], (val, key) => (key));
              const diffKeys = _.difference(this._funcParams.index, keys);

              if (diffKeys.length) {
                const error = new Error(constants.indexErrorName);
                error.name = `Wrong primary index: ${diffKeys}`;

                this._internalParams.totalIterations = 0;
                this._done = true;
                return Promise.reject(error);
              }

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

    if (!index.length || !size)
      iterator = new ChunkIterator(baseCallFunction, funcParams, baseChangeFunction);
    else
      iterator = new ChunkIterator(indexCallFunction, funcParams, indexChangeFunction);

    return api.getDatasetDataCountAsync(datasetId, match)
              .then((val) => {
                let iterations = 0;

                if (val.count < size)
                  size = val.count;

                if (type.length && size && val.count)
                  iterations = parseInt(Math.floor(val.count / size) + ((val.count % size) ? 1 : 0));
                else if (!size && val.count)
                  iterations = 1;

                iterator.setInternalParam("totalCount", val.count);
                iterator.setInternalParam("totalIterations", iterations);
                iterator.setInternalParam("iterationNumber", 0);
                iterator.setInternalParam("matchFilter", {});
                iterator.setInternalParam("chunkSize", size);

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

    return getFirstOrderIterator(datasetId, params)
            .then((iterator) => {
              if (iterator.getInternalParam("totalIterations")) {
                const iterList = Array.from(new Array(iterator.getInternalParam("totalIterations")), (val, index) => index + 1);
                return Promise.reduce(iterList, (output) => {
                  return iterator.next().then((val) => {
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
    params.type = [{"$min": constants.fieldStrKey}];

    const init = helper.getInitAccumulator(params.fields, params.type);
    const processChunk = function(input, output, iterator) {
      output[constants.countResultFieldName] += input[constants.countResultFieldName];

      _.forEach(params.fields, (field) => {
        output[field][0] = Math.min(output[field][0], input[field][0]);
      });

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
    params.type = [{"$max": constants.fieldStrKey}];

    const init = helper.getInitAccumulator(params.fields, params.type);
    const processChunk = function(input, output, iterator) {
      output[constants.countResultFieldName] += input[constants.countResultFieldName];

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
    params.type = [{"$sum": constants.fieldStrKey}];

    const init = helper.getInitAccumulator(params.fields, params.type);
    const processChunk = function(input, output, iterator) {
      output[constants.countResultFieldName] += input[constants.countResultFieldName];
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
    return getSumChunk(datasetId, params, cf)
            .then((output) => {
              params.type = [{"$avg": constants.fieldStrKey}];

              let avgOutput = helper.getInitAccumulator(params.fields, params.type);
              avgOutput[constants.countResultFieldName] = output[constants.countResultFieldName];
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
    params.type = [{"$sum": constants.fieldStrKey}, {"$sum": {"$pow": [constants.fieldStrKey, 2]}}];

    const init = helper.getInitAccumulator(params.fields, params.type);

    const processChunk = function(input, output, iterator) {
      output.count += input.count;
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
              _.forEach(params.fields, (field) => {
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
