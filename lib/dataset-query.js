module.exports = (function() {
  "use strict";
  
  let api;

  const aggregate = function(datasetId, pipeline, options, timeout) {
    const race = [];

    timeout = timeout || 0;

    const timePromise =
      new Promise((resolve, reject) => {
        setTimeout(() => (reject(new Error("Aggregate timeout"))), timeout);
      });

    const aggregatePromise = api.getAggregateDataAsync(datasetId, JSON.stringify(pipeline), options);
    race.push(timePromise);
    race.push(aggregatePromise);

    if (timeout)
      return Promise.race(race);
    else
      return aggregatePromise;
  };

  function DatasetQuery(tdxApi) {
    api = tdxApi;
    this.aggregate = aggregate;
  }

  return DatasetQuery;
}());
