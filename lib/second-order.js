module.exports = (function() {
  "use strict";

  const _ = require("lodash");
  const Promise = require("bluebird");

  const FirstOrderApi = require("./first-order");
  const helper = require("./helper-func");
  const DatasetQuery = require("./dataset-query");
  const constants = require("./constants");

  let aggregate = function() {};
  let getFirstOrder = function() {};

  // Returns the histogram given a binIndex and a primary index
  const getBasicBins = function(datasetId, params) {
    const pipeline = [];

    // Add the match operand
    if (!_.isEmpty(params.match))
      pipeline.push({"$match": params.match});

    // Add the sort operand
    // Sort on the primary indices
    const sort = helper.getSort(params.index, 1);
    if (!_.isEmpty(sort))
      pipeline.push({"$sort": sort});

    // Add the limit operand
    if (params.limit > 0)
      pipeline.push({"$limit": params.limit});

    // Extract the projection fields from the type and field parameters
    // Field parameter is a String
    // getProject requires an array of field Strings
    const project = helper.getProject([params.field]);

    if (!_.isEmpty(project))
      pipeline.push({"$project": project});

    // Add the group operand
    const binGroup = helper.getBinGroup(params.binIndex, params.field);
    pipeline.push({"$group": binGroup});

    return aggregate(datasetId, pipeline, null, params.timeout)
            .then((val) => {
              // Assign the binIndex to the transformed value
              const binnedObj = _.assign(helper.transformBin(val.data[0]), {binIndex: params.binIndex});
              return Promise.resolve(binnedObj);
            });
  };

  const getHistogram = function(datasetId, params) {
    params.match = params.match || {};
    params.field = params.field || [];
    params.timeout = params.timeout || 0;
    params.binIndex = params.binIndex || {};

    // Assign the default bin type to "number"
    params.binIndex["type"] = params.binIndex["type"] || constants.binTypes[0];
    params.binIndex["low"] = params.binIndex["low"] || [];
    params.binIndex["upp"] = params.binIndex["upp"] || [];
    params.binIndex["count"] = params.binIndex["count"] || 0;
    params.index = params.index || [];
    params.limit = params.limit || 0;

    // Return error if wrong bin index lengths
    const error = new Error(constants.binLenErrorName);
    if (params.binIndex.low.length !== params.binIndex.upp.length) {
      error.name = `Wrong bin index lengths low: ${params.binIndex.low.length}, upp: ${params.binIndex.upp.length}`;
      return Promise.reject(error);
    } else {
      if (params.binIndex.low.length !== params.binIndex["count"] &&
         params.binIndex["count"] && params.binIndex.low.length) {
        error.name = `Wrong bin index length: ${params.binIndex.low.length} and count: ${params.binIndex["count"]}`;
        return Promise.reject(error);
      }
    }

    let retPromise = Promise.resolve();

    // Get the min, max and compute the bin indices
    if (!params.binIndex.low.length && params.binIndex["count"]) {
      const npar = _.pick(params, ["match", "timeout"]);

      // First order fields parameter is an array
      npar.fields = [params.field];

      // Assign the min and max operators
      npar.type = [{"$min": constants.fieldStrKey}, {"$max": constants.fieldStrKey}];
      retPromise = getFirstOrder(datasetId, npar)
                    .then((result) => {
                      // Compute the bin indices
                      const left = result[params.field][0];
                      const right = result[params.field][1];
                      // Get the step size for the bin indices
                      const step = (right - left) / params.binIndex["count"];
                      const binArr = helper.getBinBounds(left, right, step);
                      params.binIndex["low"] = binArr["low"];
                      params.binIndex["upp"] = binArr["upp"];
                      return Promise.resolve();
                    });
    } else if (params.binIndex.low.length && !params.binIndex["count"])
      params.binIndex["count"] = params.binIndex.low.length;

    return retPromise.then(() => {
      return getBasicBins(datasetId, params);
    });
  };

  function SecondOrderAPI(tdxApi, authFunc) {
    aggregate = new DatasetQuery(tdxApi, authFunc).aggregate;
    getFirstOrder = new FirstOrderApi(tdxApi, authFunc).getFirstOrder;

    this.getBasicBins = getBasicBins;
    this.getHistogram = getHistogram;
  }

  return SecondOrderAPI;
}());
