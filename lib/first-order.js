module.exports = (function() {
  "use strict";

  const _ = require("lodash");
  const Promise = require("bluebird");

  const helper = require("./helper-func");
  const DatasetQuery = require("./dataset-query");
  const constants = require("./constants");

  let aggregate = function() {};
  let api;

  // Basic aggregation commands
  const getBasic = function(datasetId, params) {
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

    // Add the projection operand
    const projectFields = [];
    _.forEach(params.types, (type) => {
      // Extract the projection fields from the type and fields parameters
      const nfields = helper.extractFields(type, params.fields);
      _.forEach(nfields, (val) => {
        if (projectFields.indexOf(val) < 0)
          projectFields.push(val);
      });
    });

    // Prepare the projection operand
    const project = helper.getProject(projectFields.concat(params.fields));

    if (!_.isEmpty(project))
      pipeline.push({"$project": project});

    // Add the group operand
    const group = helper.getGroup(params.types, params.fields);
    pipeline.push({"$group": group});

    return aggregate(datasetId, pipeline, null, params.timeout)
            .then((val) => {
              return Promise.resolve(helper.transform(val.data[0], params.types.length, params.fields));
            });
  };

  const getFirstOrder = function(datasetId, params) {
    params.types = params.types || [];
    params.match = params.match || {};
    params.fields = params.fields || [];
    params.index = params.index || [];
    params.limit = params.limit || 0;
    params.timeout = params.timeout || 0;

    return getBasic(datasetId, params);
  };

  const getMin = function(datasetId, match, fields, timeout) {
    const params = {
      types: [{"$min": constants.fieldStrKey}],
      match: match,
      fields: fields,
      timeout: timeout,
    };

    return getFirstOrder(datasetId, params);
  };

  const getMax = function(datasetId, match, fields, timeout) {
    const params = {
      types: [{"$max": constants.fieldStrKey}],
      match: match,
      fields: fields,
      timeout: timeout,
    };

    return getFirstOrder(datasetId, params);
  };

  const getSum = function(datasetId, match, fields, timeout) {
    const params = {
      types: [{"$sum": constants.fieldStrKey}],
      match: match,
      fields: fields,
      timeout: timeout,
    };

    return getFirstOrder(datasetId, params);
  };

  const getAvg = function(datasetId, match, fields, timeout) {
    const params = {
      types: [{"$avg": constants.fieldStrKey}],
      match: match,
      fields: fields,
      timeout: timeout,
    };

    return getFirstOrder(datasetId, params);
  };

  const getStdSample = function(datasetId, match, fields, timeout) {
    const params = {
      types: [{"$stdDevSamp": constants.fieldStrKey}],
      match: match,
      fields: fields,
      timeout: timeout,
    };

    return getFirstOrder(datasetId, params);
  };

  const getStdPopulation = function(datasetId, match, fields, timeout) {
    const params = {
      types: [{"$stdDevPop": constants.fieldStrKey}],
      match: match,
      fields: fields,
      timeout: timeout,
    };

    return getFirstOrder(datasetId, params);
  };

  const getMed = function(datasetId, match, fields, timeout) {
    let pipeline;
    const ret = {};
    let limit = 1;
    let count;

    match = match || {};
    fields = fields || [];
    timeout = timeout || 0;

    return api.getDatasetDataCountAsync(datasetId, match)
            .then((val) => {
              count = val.count;
              ret[constants.countResultFieldName] = count;

              if (!fields.length || !count)
                return Promise.resolve(ret);

              return Promise.reduce(fields, (output, field) => {
                pipeline = [];

                // Add the match operand
                if (!_.isEmpty(match))
                  pipeline.push({"$match": match});

                // Extract the middle two documents from a dataset for a given match
                pipeline.push({"$sort": helper.getSort([field], 1)});
                pipeline.push({"$project": helper.getProject([field])});
                pipeline.push({"$limit": Math.floor(count / 2) + 1});
                pipeline.push({"$sort": helper.getSort([field], -1)});

                // Check if even or not
                if (!(count % 2) && count > 1)
                  limit++;

                pipeline.push({"$limit": limit});

                return aggregate(datasetId, pipeline, null, timeout)
                  .then((val) => {
                    let median;

                    // Compute the median for the set of documents
                    if (val.data.length === 1)
                      median = val.data[0][field];
                    else
                      median = (val.data[0][field] + val.data[1][field]) / 2;

                    output[field] = [median];
                    return output;
                  });
              }, ret);
            });
  };

  function FirstOrderAPI(tdxApi, authFunc) {
    api = tdxApi;
    aggregate = new DatasetQuery(tdxApi, authFunc).aggregate;

    this.getFirstOrder = getFirstOrder;
    this.getBasic = getBasic;
    this.getMin = getMin;
    this.getMax = getMax;
    this.getSum = getSum;
    this.getAvg = getAvg;
    this.getStdSample = getStdSample;
    this.getStdPopulation = getStdPopulation;
    this.getMed = getMed;
  }

  return FirstOrderAPI;
}());
