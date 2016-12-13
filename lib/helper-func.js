module.exports = (function() {
  const constants = require("./constants");
  const _ = require("lodash");

  const auth = function() {
    return function(cb) {
      return this.authenticate().then(() => (cb()));
    };
  };

  const aggregate = function() {
    return function(datasetId, pipeline, options, timeout) {
      const race = [];

      timeout = timeout || 0;

      const timePromise =
        new Promise((resolve, reject) => {
          setTimeout(() => (reject(new Error("Aggregate timeout"))), timeout);
        });

      const aggregatePromise = this.tdxApi.getAggregateDataAsync(datasetId, JSON.stringify(pipeline), options);
      race.push(timePromise);
      race.push(aggregatePromise);

      if (timeout)
        return Promise.race(race);
      else
        return aggregatePromise;
    };
  };

  const getGroup = function(type, fields) {
    const group = {};

    if (type.length === 1) {
      group["_id"] = null;
      group[constants.countFieldName] = {"$sum": 1};
      _.forEach(fields, (val) => {
        const obj = {};
        obj[type[0]] = `$${val}`;
        group[val] = obj;
      });
    }

    return group;
  };

  return ({
    auth: auth,
    aggregate: aggregate,
    getGroup: getGroup,
  });
}());
