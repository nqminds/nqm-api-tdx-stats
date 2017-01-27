module.exports = (function() {
  "use strict";

  const Promise = require("bluebird");
  const _ = require("lodash");
  const helper = require("./helper-func");
  const ChunkIterator = require("./chunk-iterator");
  const DatasetQuery = require("./dataset-query");
  const constants = require("./constants");

  let aggregate = function() {};
  let api;

  // Iterator call function for a nonempty set of indices
  const indexCallFunction = function(changeOutput) {
    // Check if no iteration required (index error)
    // Set the this._done flag to true and return an empty object
    if (!this._internalParams.totalIterations) {
      const obj = {};
      obj[constants.countResultFieldName] = this._internalParams.totalCount;
      this._done = true;
      return Promise.resolve(obj);
    }

    this._internalParams.iterationNumber++;

    // Check if total iterations reached
    if (this._internalParams.iterationNumber >= this._internalParams.totalIterations)
      this._done = true;

    return this._groupFunc(changeOutput.datasetId, changeOutput.params);
  };

  const indexChangeFunction = function() {
    // Skip the index search if the index is empty or chunk size is zero
    if (!this._funcParams.params.index.length || !this._funcParams.params.chunkSize)
      return Promise.resolve({datasetId: this._funcParams.datasetId, params: this._funcParams.params});

    let match = _.clone(this._internalParams.matchFilter);
    const limit = this._internalParams.chunkSize;

    // Set the calling function match parameter
    if (_.isEmpty(this._internalParams.matchFilter))
      match = this._funcParams.params.match;

    // Add the index query bound to the match filter
    const pipeline = helper.pipeBounds(match, this._funcParams.params.index, limit);

    if (!this._internalParams.totalIterations)
      return Promise.resolve({});

    // Find the index query bound
    return aggregate(this._funcParams.datasetId, pipeline, null, this._funcParams.params.timeout)
            .then((val) => {
              const keys = _.map(val.data[0], (val, key) => (key));
              const diffKeys = _.difference(this._funcParams.params.index, keys);

              // Check the existance of the set of primary indices
              if (diffKeys.length) {
                const error = new Error(constants.indexErrorName);
                error.name = `Wrong primary index: ${diffKeys}`;

                this._internalParams.totalIterations = 0;
                this._done = true;
                return Promise.reject(error);
              }

              // Extract the query bounds for the primary indices
              // Add the query bounds to the match filter
              this._internalParams.matchFilter =
                helper.addMatch(this._funcParams.params.match,
                helper.computeBounds(_.pick(val.data[0], this._funcParams.params.index)));

              // Make a copy of the function parameters
              const params = _.omit(this._funcParams.params, ["match", "limit"]);
              params.match = match;
              params.limit = limit;

              return Promise.resolve({datasetId: this._funcParams.datasetId, params: params});
            });
  };

  // Sets the internal parameters of the iterator
  // docCount is the document count matched by params.match
  const setIteratorParams = function(iterator, params, docCount) {
    let size = params.chunkSize;
    let iterations = 0;

    if (docCount < size)
      size = docCount;

    // Compute the number of iterations based on the number of documents
    if (params.types.length && size && docCount)
      iterations = parseInt(Math.floor(docCount / size) + ((docCount % size) ? 1 : 0));
    else if (!size && docCount)
      iterations = 1;

    // Set the internal parameters used in the ChunkIterator object
    iterator.setInternalParam("totalCount", docCount);
    iterator.setInternalParam("totalIterations", iterations);
    iterator.setInternalParam("iterationNumber", 0);
    iterator.setInternalParam("matchFilter", {});
    iterator.setInternalParam("chunkSize", size);
  };

  const getChunkIterator = function(groupParams, groupFunc, countObj) {
    countObj = countObj || {};
    // Create a new iterator object
    const iterator = new ChunkIterator(indexChangeFunction, indexCallFunction, groupParams, groupFunc);

    // Check if we already have the document count
    // if so return only the iterator without executing the getDatasetDataCountAsync
    if (!_.isEmpty(countObj)) {
      setIteratorParams(iterator, groupParams.params, countObj.count);
      return Promise.resolve(iterator);
    }

    // Retrieve the number of documents matching the match parameter
    return api.getDatasetDataCountAsync(groupParams.datasetId, groupParams.params.match)
              .then((val) => {
                setIteratorParams(iterator, groupParams.params, val.count);
                // Return a ChunkIterator object
                return Promise.resolve(iterator);
              });
  };

  function ChunkCommon(tdxApi, authFunc) {
    api = tdxApi;
    aggregate = new DatasetQuery(tdxApi, authFunc).aggregate;
    this.getChunkIterator = getChunkIterator;
  }

  return ChunkCommon;
}());
