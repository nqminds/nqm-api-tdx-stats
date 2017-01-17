/* eslint-env mocha */

const chai = require("chai");
const chaiAsPromised = require("chai-as-promised");
const Promise = require("bluebird");

chai.use(chaiAsPromised);
chai.should();

const TDXApiStats = require("../lib/api.js");
const config = {
  "commandHost": "https://cmd.nqminds.com",
  "queryHost": "https://q.nqminds.com",
};
const shareKeyID = "Syl5oSTRme";
const shareKeySecret = "root";

// Toby Ealden/Big data/Educational achievements
const datasetId = "VyZFr8hWzg";

const configNqm = {
  "commandHost": "https://cmd.nq-m.com",
  "queryHost": "https://q.nq-m.com",
};

const shareKeyIDNqm = "ryelV9N3mg";
const shareKeySecretNqm = "root";

// Alexandru Mereacre/1 Test/MK Parking Locations
const datasetIdNqm = "Sygy_xBhml";

const testInputs = [
  {type: ["$min"], fields: ["ecode"]},                                                  // Test [1]
  {type: ["$min"], fields: ["ecode", "rate"]},                                          // Test [2]
  {type: ["$min"], match: {"name": "Surrey"}, fields: ["ecode", "rate"]},               // Test [3]
  {type: ["$min"], fields: ["ecode"]},                                                  // Test [4]
  {type: ["$min", "$max", "$avg"], fields: ["ecode", "rate"]},                          // Test [5]
  {type: ["$min", "$max", "$avg"], fields: []},                                         // Test [6]
  {type: ["$stdDevPop"], match: {"BayType": "Public"}, fields: ["BayCount"]},           // Test [7]
  {type: [], match: {"BayType": "Electric"}, fields: ["BayCount", "LotCode"]},          // Test [8]
  {type: [], match: {"BayType": "Mobility bays"}, fields: ["BayCount", "LotCode"]},     // Test [9]
];

const testOutputs = [
  {                       // Test [1]
    count: 608,
    ecode: {
      "$min": 201,
    },
  },
  {                       // Test [2]
    count: 608,
    ecode: {
      "$min": 201,
    },
    rate: {
      "$min": 0,
    },
  },
  {                       // Test [3]
    count: 4,
    ecode: {
      "$min": 936,
    },
    rate: {
      "$min": 30,
    },
  },
  {},                     // Test [4]
  {                       // Test [5]
    count: 608,
    ecode: {
      "$min": 201,
      "$max": 938,
      "$avg": 613.578947368421,
    },
    rate: {
      "$min": 0,
      "$max": 166,
      "$avg": 63.41940789473684,
    },
  },
  {                       // Test [6]
    count: 608,
  },
  {                       // Test [7]
    count: 16,
    BayCount: {
      "$stdDevPop": 5.97,
    },
  },
  {                       // Test [8]
    count: 2,
    BayCount: {
      "$med": 3.5,
    },
    LotCode: {
      "$med": 4.5,
    },
  },
  {                       // Test [9]
    count: 3,
    BayCount: {
      "$med": 2,
    },
    LotCode: {
      "$med": 12,
    },
  },
];

const testTimeout = 20000;
const apiTimeout = 10000;

describe("first-order.js", function() {
  this.timeout(testTimeout);

  describe(`for test dataset: ${datasetId}`, function() {
    // Test [1]
    it(`should return the minimum for the fields ${JSON.stringify(testInputs[0].fields)}`, function() {
      const test = 0;

      const api = new TDXApiStats(config);
      api.setShareKey(shareKeyID, shareKeySecret);
      const params = {
        type: testInputs[test].type,
        fields: testInputs[test].fields,
        timeout: apiTimeout,
      };

      return api.getFirstOrder(datasetId, params)
          .then((val) => {
            return Promise.resolve(val);
          })
          .should.eventually.deep.equal(testOutputs[test]);
    });
    // Test [2]
    it(`should return the minimum for the fields ${JSON.stringify(testInputs[1].fields)}`, function() {
      const test = 1;

      const api = new TDXApiStats(config);
      api.setShareKey(shareKeyID, shareKeySecret);
      const params = {
        type: testInputs[test].type,
        fields: testInputs[test].fields,
        timeout: apiTimeout,
      };

      return api.getFirstOrder(datasetId, params)
          .then((val) => {
            return Promise.resolve(val);
          })
          .should.eventually.deep.equal(testOutputs[1]);
    });

    // Test [3]
    it(`should return the minimum for the fields ${JSON.stringify(testInputs[2].fields)}
        with the match ${JSON.stringify(testInputs[2].match)}`, function() {
      const test = 2;
      const api = new TDXApiStats(config);

      api.setShareKey(shareKeyID, shareKeySecret);
      const params = {
        type: testInputs[test].type,
        match: testInputs[test].match,
        fields: testInputs[test].fields,
        timeout: apiTimeout,
      };
      return api.getFirstOrder(datasetId, params)
          .then((val) => {
            return Promise.resolve(val);
          })
          .should.eventually.deep.equal(testOutputs[test]);
    });

    // Test [4]
    it("should timeout", function() {
      // set the minimum timeout
      const test = 3;

      const api = new TDXApiStats(config);
      api.setShareKey(shareKeyID, shareKeySecret);
      const params = {
        type: testInputs[test].type,
        fields: testInputs[test].fields,
        timeout: 1,
      };

      return api.getFirstOrder(datasetId, params)
              .should.be.rejected;
    });

    // Test [5]
    it(`should return the minimum for the fields ${JSON.stringify(testInputs[4].fields)}`, function() {
      const test = 4;

      const api = new TDXApiStats(config);
      api.setShareKey(shareKeyID, shareKeySecret);
      const params = {
        type: testInputs[test].type,
        fields: testInputs[test].fields,
        timeout: apiTimeout,
      };

      return api.getFirstOrder(datasetId, params)
          .then((val) => {
            return Promise.resolve(val);
          })
          .should.eventually.deep.equal(testOutputs[test]);
    });

    // Test [6]
    it(`should return only the count for the empty set of fields ${JSON.stringify(testInputs[4].fields)}`, function() {
      const test = 5;

      const api = new TDXApiStats(config);
      api.setShareKey(shareKeyID, shareKeySecret);
      const params = {
        type: testInputs[test].type,
        fields: testInputs[test].fields,
        timeout: apiTimeout,
      };

      return api.getFirstOrder(datasetId, params)
          .then((val) => {
            return Promise.resolve(val);
          })
          .should.eventually.deep.equal(testOutputs[test]);
    });

    // Test [7]
    it(`should return the standard deviation for the fields ${JSON.stringify(testInputs[6].fields)}
        with the match ${JSON.stringify(testInputs[6].match)}`, function() {
      const test = 6;
      const api = new TDXApiStats(configNqm);

      api.setShareKey(shareKeyIDNqm, shareKeySecretNqm);
      const params = {
        type: testInputs[test].type,
        match: testInputs[test].match,
        fields: testInputs[test].fields,
        timeout: apiTimeout,
      };

      return api.getFirstOrder(datasetIdNqm, params)
          .then((val) => {
            val["BayCount"]["$stdDevPop"] = Math.round(parseFloat(val["BayCount"]["$stdDevPop"]) * 100) / 100;
            return Promise.resolve(val);
          })
          .should.eventually.deep.equal(testOutputs[test]);
    });

    // Test [8]
    it(`should return the median for the fields ${JSON.stringify(testInputs[7].fields)}
        with the match ${JSON.stringify(testInputs[7].match)}`, function() {
      const test = 7;
      const api = new TDXApiStats(configNqm);

      api.setShareKey(shareKeyIDNqm, shareKeySecretNqm);

      return api.getMed(datasetIdNqm, testInputs[test].match, testInputs[test].fields, apiTimeout)
          .should.eventually.deep.equal(testOutputs[test]);
    });

    // Test [9]
    it(`should return the median for the fields ${JSON.stringify(testInputs[8].fields)}
        with the match ${JSON.stringify(testInputs[8].match)}`, function() {
      const test = 8;
      const api = new TDXApiStats(configNqm);

      api.setShareKey(shareKeyIDNqm, shareKeySecretNqm);

      return api.getMed(datasetIdNqm, testInputs[test].match, testInputs[test].fields, apiTimeout)
          .should.eventually.deep.equal(testOutputs[test]);
    });
  });
});
