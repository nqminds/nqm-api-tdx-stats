module.exports = (function() {
  "use strict";

  const _ = require("lodash");
  const helper = require("./helper-func");
  const FirstOrderApi = require("./first-order");
  const ChunkIterator = require("./chunk-iterator");
  const DatasetQuery = require("./dataset-query");
  const constants = require("./constants");

  let aggregate = function() {};
  let getBasic = function() {};
  let api;

  const baseCallFunction = function(changeOutput) {
    return getBasic(this._funcParams.type, this._funcParams.datasetId,
                          this._funcParams.match, this._funcParams.fields,
                          [], 0, this._funcParams.timeout)
            .then((val) => {
              this._done = true;
              return Promise.resolve(val);
            });
  };

  const baseChangeFunction = function() {
    return Promise.resolve({});
  };

  const indexCallFunction = function(changeOutput) {
    return getBasic(this._funcParams.type, this._funcParams.datasetId, changeOutput.match,
                    this._funcParams.fields, this._funcParams.index, changeOutput.limit, this._funcParams.timeout)
            .then((val) => {
              this._internalParams.iterationNumber++;

              if (this._internalParams.iterationNumber >= this._internalParams.totalIterations)
                this._done = true;

              return Promise.resolve(val);
            });

    // const pipeline = [];

    // if (!_.isEmpty(changeOutput.match))
    //   pipeline.push({"$match": changeOutput.match});

    // const sort = helper.getSort(this._funcParams.index, 1);
    // pipeline.push({"$sort": sort});
    // pipeline.push({"$limit": changeOutput.limit});

    // const project = helper.getProject(this._funcParams.fields);
    // if (!_.isEmpty(project))
    //   pipeline.push({"$project": project});

    // pipeline.push({"$group": helper.getGroup(this._funcParams.type, this._funcParams.fields)});

    // return aggregate(this._funcParams.datasetId, pipeline, null, this._funcParams.timeout)
    //         .then((val) => {
    //           const res = helper.transform(val.data[0], this._funcParams.type, this._funcParams.fields);
    //           this._internalParams.iterationNumber++;

    //           if (this._internalParams.iterationNumber >= this._internalParams.totalIterations)
    //             this._done = true;

    //           return Promise.resolve(res);
    //         });
  };

  const indexChangeFunction = function() {
    let match = _.clone(this._internalParams.matchFilter);
    const limit = this._internalParams.chunkSize;

    if (_.isEmpty(this._internalParams.matchFilter))
      match = this._funcParams.match;

    const pipeline = helper.pipeBounds(match, this._funcParams.index, limit);

    return aggregate(this._funcParams.datasetId, pipeline, null, this._funcParams.timeout)
            .then((val) => {
              this._internalParams.matchFilter =
                helper.addMatch(this._funcParams.match,
                helper.computeBounds(_.pick(val.data[0], this._funcParams.index)));
              return Promise.resolve({match: match, limit: limit});
            });
  };

  function getChunk(type, datasetId, match, fields, index, chunkSize, timeout) {
    index = index || [];
    match = match || {};
    fields = fields || [];
    let size = chunkSize || constants.chunkSize;

    const funcParams = {type: type, datasetId: datasetId, match: match, fields: fields, index: index, timeout: timeout};
    let iterator;

    if (!index.length)
      iterator = new ChunkIterator(baseCallFunction, funcParams, baseChangeFunction);
    else
      iterator = new ChunkIterator(indexCallFunction, funcParams, indexChangeFunction);

    return api.getDatasetDataCountAsync(datasetId, match)
              .then((val) => {
                if (val.count < size)
                  size = val.count;

                const iterations = parseInt(Math.floor(val.count / size) + ((val.count % size) ? 1 : 0));

                iterator.setInternalParam("totalCount", val.count);
                iterator.setInternalParam("totalIterations", iterations);
                iterator.setInternalParam("iterationNumber", 0);
                iterator.setInternalParam("matchFilter", {});
                iterator.setInternalParam("chunkSize", size);

                return Promise.resolve(iterator);
              });
  }

  const getFirstOrderChunk = function(type, datasetId, match, fields, index, chunkSize, timeout) {
    return getChunk(type, datasetId, match, fields, index, chunkSize, timeout);
  };

  function FirstOrderChunkAPI(tdxApi, authFunc) {
    api = tdxApi;

    getBasic = new FirstOrderApi(tdxApi, authFunc).getBasic;
    aggregate = new DatasetQuery(tdxApi, authFunc).aggregate;

    this.getFirstOrderChunk = getFirstOrderChunk;
  }

  return FirstOrderChunkAPI;
}());
