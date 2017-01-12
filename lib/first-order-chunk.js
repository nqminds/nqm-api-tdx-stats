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

  const baseCallFunction = function() {
    return getFirstOrder(this._funcParams.type, this._funcParams.datasetId,
                          this._funcParams.match, this._funcParams.fields, 
                          this._funcParams.timeout);
  };

  const baseChangeFunction = function() {
    this._done = true;
    return Promise.resolve();
  };

  const indexCallFunction = function() {
    const argumentList = _.map(arguments, (val, key) => (val));

    const type = argumentList[0];
    const datasetId = argumentList[1];
    const match = argumentList[2];
    const fields = argumentList[3];
    const index = argumentList[4];
    const timeout = argumentList[5];
    const count = argumentList[6];
    const limit = argumentList[7];

    const pipeline = helper.pipeBounds(index, constants.searchLimit);

    argumentList[7] += constants.searchLimit;

    return aggregate(datasetId, pipeline, null, timeout)
            .then((val) => {
              console.log(val);
              return getFirstOrder.apply(null, argumentList);
            })
            .catch((err) => {
              return Promise.reject(err);
            });
  };

  const indexChangeFunction = function() {
    const argumentList = _.map(arguments, (val, key) => (val));
    // const match = argumentList[2];
    // const index = argumentList[4];

    // argumentList[2] = helper.addMatch(match, index);

    return {done: false, arguments: argumentList};
  };

  function getChunk(type, datasetId, match, fields, index, timeout) {
    index = index || [];

    const funcParams = {type: type, datasetId: datasetId, match: match, fields: fields, index: index, timeout: timeout};
    let iterator;

    if (!index.length)
      iterator = new ChunkIterator(baseCallFunction, funcParams, baseChangeFunction);
    else
      iterator = new ChunkIterator(indexCallFunction, funcParams, indexChangeFunction);

    return api.getDatasetDataCountAsync(datasetId, match)
              .then((val) => {
                // funcParams[countIdx] = val.count;
                // iterator.setCount(val.count);
                // iterator.setParams(funcParams);
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
