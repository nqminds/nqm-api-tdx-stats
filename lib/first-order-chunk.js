module.exports = (function() {
  "use strict";

  const _ = require("lodash");
  const helper = require("./helper-func");
  const constants = require("./constants");
  const FirstOrderApi = require("./first-order");
  const ChunkIterator = require("./chunk-iterator");
  const DatasetQuery = require("./dataset-query");

  let aggregate = function() {};
  let getFirstOrder = function() {};
  let api;

  const baseCallFunction = function(changeOutput) {
    return getFirstOrder(this._funcParams.type, this._funcParams.datasetId,
                          this._funcParams.match, this._funcParams.fields,
                          0, this._funcParams.timeout)
            .then((val) => {
              this._done = true;
              return Promise.resolve(val);
            });
  };

  const baseChangeFunction = function() {
    return Promise.resolve({});
  };

  const indexCallFunction = function(changeOutput) {
    return getFirstOrder(this._funcParams.type, this._funcParams.datasetId,
                          changeOutput.match, this._funcParams.fields,
                          changeOutput.limit, this._funcParams.timeout)
            .then((val) => {
              console.log(val);
              this._internalParams.searchLimit = changeOutput.limit;
              this._internalParams.searchCount += changeOutput.limit;

              if (this._internalParams.searchCount >= this._internalParams.totalCount)
                this._done = true;

              return Promise.resolve(val);
            });
  };

  const indexChangeFunction = function() {
    let match = _.clone(this._internalParams.matchFilter);
    let limit = this._internalParams.searchLimit;
    const totalLimit = this._internalParams.searchCount + limit;

    if (this._internalParams.searchCount < this._internalParams.totalCount &&
        totalLimit > this._internalParams.totalCount) {
      limit = this._internalParams.totalCount - this._internalParams.searchCount;
    }

    let pipeline;

    if (_.isEmpty(this._internalParams.matchFilter))
      match = this._funcParams.match;

    pipeline = helper.pipeBounds(match, this._funcParams.index, limit);
    return aggregate(this._funcParams.datasetId, pipeline, null, this._funcParams.timeout)
            .then((val) => {
              this._internalParams.matchFilter =
                helper.addMatch(this._funcParams.match,
                helper.computeBounds(_.pick(val.data[0], this._funcParams.index)));
              console.log(val);    
              return Promise.resolve({match: match, limit: limit});
            });
  };

  function getChunk(type, datasetId, match, fields, index, timeout) {
    index = index || [];
    match = match || {};

    const funcParams = {type: type, datasetId: datasetId, match: match, fields: fields, index: index, timeout: timeout};
    let iterator;

    if (!index.length)
      iterator = new ChunkIterator(baseCallFunction, funcParams, baseChangeFunction);
    else
      iterator = new ChunkIterator(indexCallFunction, funcParams, indexChangeFunction);

    return api.getDatasetDataCountAsync(datasetId, match)
              .then((val) => {
                iterator.setInternalParams("totalCount", val.count);
                iterator.setInternalParams("matchFilter", {});
                iterator.setInternalParams("searchLimit", constants.searchLimit);
                iterator.setInternalParams("searchCount", 0);
                return Promise.resolve(iterator);
              });
  }

  const getFirstOrderChunk = function(type, datasetId, match, fields, index, timeout) {
    return getChunk(type, datasetId, match, fields, index, timeout);
  };

  function FirstOrderChunkAPI(tdxApi, authFunc) {
    api = tdxApi;
    getFirstOrder = new FirstOrderApi(tdxApi, authFunc).getFirstOrder;
    aggregate = new DatasetQuery(tdxApi, authFunc).aggregate;

    this.getFirstOrderChunk = getFirstOrderChunk;
  }

  return FirstOrderChunkAPI;
}());
