module.exports = (function() {
  "use strict";

  const DatasetQuery = require("./dataset-query");
  const FirstOrderApi = require("./first-order");

  let aggregate = function() {};
  let getFirstOrder = function() {};

  function getChunk(type, datasetId, match, fields, index, timeout) {
    index = index || [];

    if (!index.length)
      return getFirstOrder(type, datasetId, match, fields, timeout);

    return null;
  }

  const getFirstOrderChunk = function(type, datasetId, match, fields, index, timeout) {
    return getChunk(type, datasetId, match, fields, timeout);
  };

  function FirstOrderChunkAPI(tdxApi, authFunc) {
    aggregate = new DatasetQuery(tdxApi, authFunc).aggregate;
    getFirstOrder = new FirstOrderApi(tdxApi, authFunc).getFirstOrder;

    this.getFirstOrderChunk = getFirstOrderChunk;
  }

  return FirstOrderChunkAPI;
}());
