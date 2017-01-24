module.exports = (function() {
  "use strict";

  const _ = require("lodash");
  const Promise = require("bluebird");

  const helper = require("./helper-func");
  const DatasetQuery = require("./dataset-query");
  const constants = require("./constants");

  let aggregate = function() {};
  let api;

  const getBasicBins = function(datasetId, params) {
    return {};
  };

  const getBins = function(datasetId, params) {
    return {};
  };


  function SecondOrderAPI(tdxApi, authFunc) {
    api = tdxApi;
    aggregate = new DatasetQuery(tdxApi, authFunc).aggregate;

    this.getBins = getBins;
    this.getBasicBins = getBasicBins;
  }

  return SecondOrderAPI;
}());
