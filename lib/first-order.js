module.exports = (function() {
  "use strict";

  const helper = require("./helper-func");
  const DatasetQuery = require("./dataset-query");
  // const log = require("debug")("nqm-api-tdx-stats");
  const _ = require("lodash");
  let aggregate = function() {};

  const getBasic = function(type, datasetId, match, fields, index, limit, timeout) {
    const pipeline = [];

    if (!_.isEmpty(match))
      pipeline.push({"$match": match});

    const sort = helper.getSort(index, 1);
    if (!_.isEmpty(sort))
      pipeline.push({"$sort": sort});

    if (limit > 0)
      pipeline.push({"$limit": limit});

    const project = helper.getProject(fields);

    if (!_.isEmpty(project))
      pipeline.push({"$project": project});

    pipeline.push({"$group": helper.getGroup(type, fields)});

    return aggregate(datasetId, pipeline, null, timeout)
            .then((val) => {
              return Promise.resolve(helper.transform(val.data[0], type, fields));
            });
  };

  const getFirstOrder = function(datasetId, params) {
    const type = params.type || [];
    const match = params.match || {};
    const fields = params.fields || [];
    const timeout = params.timeout || 0;

    return getBasic(type, datasetId, match, fields, [], 0, timeout);
  };

  function FirstOrderAPI(tdxApi, authFunc) {
    aggregate = new DatasetQuery(tdxApi, authFunc).aggregate;

    this.getFirstOrder = getFirstOrder;
    this.getBasic = getBasic;
  }

  return FirstOrderAPI;
}());
