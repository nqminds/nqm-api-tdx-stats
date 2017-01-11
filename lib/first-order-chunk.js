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

  const indexChangeFunction = function(params) {
    const argumentList = _.map(arguments, (val, key) => (val));

    return {done: false, arguments: argumentList};
  };

  function getChunk(type, datasetId, match, fields, index, timeout) {
    index = index || [];
    const countIdx = 6;
    const funcParams = [type, datasetId, match, fields, index, timeout, 0, 0];
    let iterator;

    if (!index.length)
      iterator = new ChunkIterator(baseCallFunction, funcParams, baseChangeFunction);
    else
      iterator = new ChunkIterator(indexCallFunction, funcParams, indexChangeFunction);

    return api.getDatasetDataCountAsync(datasetId, match)
              .then((val) => {
                funcParams[countIdx] = val.count;
                iterator.setCount(val.count);
                iterator.setParams(funcParams);
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
