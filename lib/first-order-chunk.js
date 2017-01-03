module.exports = (function() {
  "use strict";

  const FirstOrderApi = require("./first-order");
  const ChunkIterator = require("./chunk-iterator");

  let getFirstOrder = function() {};

  function getChunk(type, datasetId, match, fields, index, timeout) {
    index = index || [];

    if (!index.length)
      return getFirstOrder(type, datasetId, match, fields, timeout);

    return null;
  }

  const getFirstOrderChunk = function(type, datasetId, match, fields, index, timeout) {
    return getChunk(type, datasetId, match, fields, index, timeout);
  };

  function FirstOrderChunkAPI(tdxApi, authFunc) {
    getFirstOrder = new FirstOrderApi(tdxApi, authFunc).getFirstOrder;

    this.getFirstOrderChunk = getFirstOrderChunk;
  }

  return FirstOrderChunkAPI;
}());
