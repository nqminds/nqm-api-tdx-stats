module.exports = (function() {
  "use strict";

  const _ = require("lodash");
  const Promise = require("bluebird");

  const helper = require("./helper-func");
  const DatasetQuery = require("./dataset-query");
  const constants = require("./constants");

  let aggregate = function() {};
  let api;

  const getMinIndexed = function(datasetId, params) {
      return null;
  };

  const getMaxIndexed = function(datasetId, params) {
      return null;
  };

  function FirstOrderIndexedAPI(tdxApi, authFunc) {
    api = tdxApi;
    aggregate = new DatasetQuery(tdxApi, authFunc).aggregate;

    this.getMinIndexed = getMinIndexed;
    this.getMaxIndexed = getMaxIndexed;
  }

  return FirstOrderIndexedAPI;
}());
