module.exports = (function() {
  "use strict";

  const _ = require("lodash");
  const Promise = require("bluebird");

  const helper = require("./helper-func");
  const constants = require("./constants");

  let api;

  function getMinMaxIndexed(datasetId, params, type) {
    const retObj = {};
    params.match = params.match || {};
    params.field = params.field || "";
    params.timeout = params.timeout || 0;

    // Return early with an empty object if params.field is empty
    if (params.field === "")
      return Promise.resolve({});

    // Add the projection operator
    const projection = {};
    projection[params.field] = 1;

    const options = {limit: 1};

    // Sort in ascending order for min and descending order for max
    const sort = {};
    if (type === "min")
      sort[params.field] = 1;
    else if (type === "max")
      sort[params.field] = -1;
    options["sort"] = sort;

    return api.getDatasetDataAsync(datasetId, params.match, projection, options)
      .then((result) => {
        if (result.data[0][params.field] === undefined)
          retObj[params.field] = [null];
        else
          retObj[params.field] = [result.data[0][params.field]];
        return Promise.resolve(retObj);
      });
  }
  const getMinIndexed = function(datasetId, params) {
    return getMinMaxIndexed(datasetId, params, "min");
  };

  const getMaxIndexed = function(datasetId, params) {
    return getMinMaxIndexed(datasetId, params, "max");
  };

  function FirstOrderIndexedAPI(tdxApi) {
    api = tdxApi;

    this.getMinIndexed = getMinIndexed;
    this.getMaxIndexed = getMaxIndexed;
  }

  return FirstOrderIndexedAPI;
}());
