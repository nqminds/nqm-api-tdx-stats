module.exports = (function() {
  "use strict";

  const _ = require("lodash");
  const Promise = require("bluebird");

  const helper = require("./helper-func");
  const DatasetQuery = require("./dataset-query");
  const constants = require("./constants");

  let aggregate = function() {};
  let api;

  const getBasic = function(types, datasetId, match, fields, index, limit, timeout) {
    const pipeline = [];

    if (!_.isEmpty(match))
      pipeline.push({"$match": match});

    const sort = helper.getSort(index, 1);
    if (!_.isEmpty(sort))
      pipeline.push({"$sort": sort});

    if (limit > 0)
      pipeline.push({"$limit": limit});

    const projectFields = [];
    _.forEach(types, (type) => {
      const nfields = helper.extractFields(type, fields);
      _.forEach(nfields, (val) => {
        if (projectFields.indexOf(val) < 0)
          projectFields.push(val);
      });
    });

    const project = helper.getProject(projectFields.concat(fields));

    if (!_.isEmpty(project))
      pipeline.push({"$project": project});

    pipeline.push({"$group": helper.getGroup(types, fields)});

    return aggregate(datasetId, pipeline, null, timeout)
            .then((val) => {
              return Promise.resolve(helper.transform(val.data[0], types.length, fields));
            });
  };

  const getFirstOrder = function(datasetId, params) {
    const types = params.type || [];
    const match = params.match || {};
    const fields = params.fields || [];
    const timeout = params.timeout || 0;

    return getBasic(types, datasetId, match, fields, [], 0, timeout);
  };

  const getMin = function(datasetId, match, fields, timeout) {
    const params = {
      type: [{"$min": "$$"}],
      match: match,
      fields: fields,
      timeout: timeout,
    };

    return getFirstOrder(datasetId, params);
  };

  const getMax = function(datasetId, match, fields, timeout) {
    const params = {
      type: [{"$max": "$$"}],
      match: match,
      fields: fields,
      timeout: timeout,
    };

    return getFirstOrder(datasetId, params);
  };

  const getSum = function(datasetId, match, fields, timeout) {
    const params = {
      type: [{"$sum": "$$"}],
      match: match,
      fields: fields,
      timeout: timeout,
    };

    return getFirstOrder(datasetId, params);
  };

  const getAvg = function(datasetId, match, fields, timeout) {
    const params = {
      type: [{"$avg": "$$"}],
      match: match,
      fields: fields,
      timeout: timeout,
    };

    return getFirstOrder(datasetId, params);
  };

  const getStdSample = function(datasetId, match, fields, timeout) {
    const params = {
      type: [{"$stdDevSamp": "$$"}],
      match: match,
      fields: fields,
      timeout: timeout,
    };

    return getFirstOrder(datasetId, params);
  };

  const getStdPopulation = function(datasetId, match, fields, timeout) {
    const params = {
      type: [{"$stdDevPop": "$$"}],
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

                if (!_.isEmpty(match))
                  pipeline.push({"$match": match});

                pipeline.push({"$sort": helper.getSort([field], 1)});
                pipeline.push({"$project": helper.getProject([field])});
                pipeline.push({"$limit": Math.floor(count / 2) + 1});
                pipeline.push({"$sort": helper.getSort([field], -1)});

                if (!(count % 2) && count > 1)
                  limit++;

                pipeline.push({"$limit": limit});

                return aggregate(datasetId, pipeline, null, timeout)
                  .then((val) => {
                    let median;

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
