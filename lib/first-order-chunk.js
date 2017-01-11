module.exports = (function() {
  "use strict";

  const _ = require("lodash");
  const helper = require("./helper-func");
  const FirstOrderApi = require("./first-order");
  const ChunkIterator = require("./chunk-iterator");

  let getFirstOrder = function() {};
  let api;

  const baseCallFunction = function(params) {
    const argumentList = _.map(arguments, (val, key) => (val));
    return getFirstOrder.apply(null, argumentList);
  };

  const baseChangeFunction = function(params) {
    const argumentList = _.map(arguments, (val, key) => (val));
    return {done: true, arguments: argumentList};
  };

  const indexCallFunction = function(params) {
    const argumentList = _.map(arguments, (val, key) => (val));
    return getFirstOrder.apply(null, argumentList);
  };

  const indexChangeFunction = function(params) {
    const argumentList = _.map(arguments, (val, key) => (val));
    return {done: false, arguments: argumentList};
  };

  function getChunk(type, datasetId, match, fields, index, timeout) {
    index = index || [];

    const funcParams = [type, datasetId, match, fields, timeout];
    let iterator;

    if (!index.length)
      iterator = new ChunkIterator(baseCallFunction, funcParams, baseChangeFunction);
    else
      iterator = new ChunkIterator(indexCallFunction, funcParams, indexChangeFunction);

    return api.getDatasetDataCountAsync(datasetId, match)
              .then((val) => {
                iterator.setCount(val.count);
                return Promise.resolve(iterator);
              });
  }

  const getFirstOrderChunk = function(type, datasetId, match, fields, index, timeout) {
    return getChunk(type, datasetId, match, fields, index, timeout);
  };

  function FirstOrderChunkAPI(tdxApi, authFunc) {
    api = tdxApi;
    getFirstOrder = new FirstOrderApi(tdxApi, authFunc).getFirstOrder;

    this.getFirstOrderChunk = getFirstOrderChunk;
  }

  return FirstOrderChunkAPI;
}());
