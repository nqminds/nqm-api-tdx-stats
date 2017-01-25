module.exports = (function() {
  "use strict";

  const _ = require("lodash");
  const Promise = require("bluebird");

  const helper = require("./helper-func");
  const DatasetQuery = require("./dataset-query");
  const constants = require("./constants");

  let aggregate = function() {};

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
    return {};
  };

  function SecondOrderAPI(tdxApi, authFunc) {
    aggregate = new DatasetQuery(tdxApi, authFunc).aggregate;

    this.getBasicBins = getBasicBins;
    this.getHistogram = getHistogram;
  }

  return SecondOrderAPI;
}());
