module.exports = (function() {
  "use strict";

  const _ = require("lodash");
  const Promise = require("bluebird");

  const SecondOrderApi = require("./second-order");
  const helper = require("./helper-func");
  const DatasetQuery = require("./dataset-query");
  const constants = require("./constants");

  let aggregate = function() {};

  const getHistogramChunk = function(datatsetId, params) {
      return null;
  };

  function SecondOrderChunkAPI(tdxApi, authFunc) {
    aggregate = new DatasetQuery(tdxApi, authFunc).aggregate;
    // getSecondOrder = new SecondOrderApi(tdxApi, authFunc).getSecondOrder;

    this.getHistogramChunk = getHistogramChunk;
  }

  return SecondOrderChunkAPI;
}());
