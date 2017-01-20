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
  {type: [{"$min": "$$"}], fields: ["ecode"]},                                                  // Test [1]
  {type: [{"$min": "$$"}], fields: ["ecode", "rate"]},                                          // Test [2]
  {type: [{"$min": "$$"}], match: {"name": "Surrey"}, fields: ["ecode", "rate"]},               // Test [3]
  {type: [{"$min": "$$"}], fields: ["ecode"]},                                                  // Test [4]
  {type: [{"$min": "$$"}, {"$max": "$$"}, {"$avg": "$$"}], fields: ["ecode", "rate"]},                          // Test [5]
  {type: [{"$min": "$$"}, {"$max": "$$"}, {"$avg": "$$"}], fields: []},                                         // Test [6]
  {type: [{"$stdDevPop": "$$"}], match: {"BayType": "Public"}, fields: ["BayCount"]},           // Test [7]
  {type: [], match: {"BayType": "Electric"}, fields: ["BayCount", "LotCode"]},          // Test [8]
  {type: [], match: {"BayType": "Mobility bays"}, fields: ["BayCount", "LotCode"]},     // Test [9]
  {type: [], match: {"BayType": "Mobility"}, fields: ["BayCount", "LotCode"]},          // Test [10]
  {type: [], match: {"BayType": "Mobility bays"}, fields: []},                          // Test [11]
  {type: [{"$min": "$$"}], match: {"name": "Surrrey"}, fields: ["ecode"]},                      // Test [12]
  {type: [], fields: ["ecode"]},                                                        // Test [13]
  {type: [{"$min": "$$"}], fields: []},                                                         // Test [14]
  {type: [], fields: []},                                                               // Test [15]
  {type: [{"$min": "$$"}], fields: ["eccode", "rrate"]},                                         // Test [16]
  {type: [{"$min": "$$"}, {"$sum": {"$pow": ["$$", 2]}}], match: {"BayType": "Mobility bays"}, fields: ["BayCount", "LotCode"]},          // Test [17]
];

const testOutputs = [
  {                       // Test [1]
    count: 608,
    ecode: [201],
  },
  {                       // Test [2]
    count: 608,
    ecode: [201],
    rate: [0],
  },
  {                       // Test [3]
    count: 4,
    ecode: [936],
    rate: [30],
  },
  {},                     // Test [4]
  {                       // Test [5]
    count: 608,
    ecode: [201, 938, 613.578947368421],
    rate: [0, 166, 63.41940789473684],
  },
  {                       // Test [6]
    count: 608,
  },
  {                       // Test [7]
    count: 16,
    BayCount: [5.967359131140006],
  },
  {                       // Test [8]
    count: 2,
    BayCount: [3.5],
    LotCode: [4.5],
  },
  {                       // Test [9]
    count: 3,
    BayCount: [2],
    LotCode: [12],
  },
  {                       // Test [10]
    count: 0,
  },
  {                       // Test [11]
    count: 3,
  },
  {                       // Test [12]
    count: 0,
  },
  {                       // Test [13]
    count: 608,
  },
  {                       // Test [14]
    count: 608,
  },
  {                       // Test [15]
    count: 608,
  },
  {                       // Test [16]
    count: 608,
    eccode: [null],
    rrate: [null],
  },
  {                       // Test [17]
    count: 3,
    BayCount: [2, 24],
    LotCode: [5, 493],
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
          // .then((val) => {
          //   val["BayCount"]["$stdDevPop"] = Math.round(parseFloat(val["BayCount"]["$stdDevPop"]) * 100) / 100;
          //   return Promise.resolve(val);
          // })
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

    // Test [10]
    it(`should return the median for the fields ${JSON.stringify(testInputs[9].fields)}
        with the match ${JSON.stringify(testInputs[9].match)}`, function() {
      const test = 9;
      const api = new TDXApiStats(configNqm);

      api.setShareKey(shareKeyIDNqm, shareKeySecretNqm);

      return api.getMed(datasetIdNqm, testInputs[test].match, testInputs[test].fields, apiTimeout)
          .should.eventually.deep.equal(testOutputs[test]);
    });

    // Test [11]
    it(`should return the median for the fields ${JSON.stringify(testInputs[10].fields)}
        with the match ${JSON.stringify(testInputs[10].match)}`, function() {
      const test = 10;
      const api = new TDXApiStats(configNqm);

      api.setShareKey(shareKeyIDNqm, shareKeySecretNqm);

      return api.getMed(datasetIdNqm, testInputs[test].match, testInputs[test].fields, apiTimeout)
          .should.eventually.deep.equal(testOutputs[test]);
    });

    // Test [12]
    it("should return count=0 for wrong match", function() {
      const test = 11;

      const api = new TDXApiStats(config);
      api.setShareKey(shareKeyID, shareKeySecret);
      const params = {
        type: testInputs[test].type,
        fields: testInputs[test].fields,
        match: testInputs[test].match,
        timeout: apiTimeout,
      };

      return api.getFirstOrder(datasetId, params)
          .should.eventually.deep.equal(testOutputs[test]);
    });

    // Test [13]
    it("should return just the count for empty type", function() {
      const test = 12;

      const api = new TDXApiStats(config);
      api.setShareKey(shareKeyID, shareKeySecret);
      const params = {
        type: testInputs[test].type,
        fields: testInputs[test].fields,
        match: testInputs[test].match,
        timeout: apiTimeout,
      };

      return api.getFirstOrder(datasetId, params)
          .should.eventually.deep.equal(testOutputs[test]);
    });

    // Test [14]
    it("should return just the count for empty fields", function() {
      const test = 13;

      const api = new TDXApiStats(config);
      api.setShareKey(shareKeyID, shareKeySecret);
      const params = {
        type: testInputs[test].type,
        fields: testInputs[test].fields,
        match: testInputs[test].match,
        timeout: apiTimeout,
      };

      return api.getFirstOrder(datasetId, params)
          .should.eventually.deep.equal(testOutputs[test]);
    });

    // Test [15]
    it("should return just the count for empty fields and type", function() {
      const test = 14;

      const api = new TDXApiStats(config);
      api.setShareKey(shareKeyID, shareKeySecret);
      const params = {
        type: testInputs[test].type,
        fields: testInputs[test].fields,
        match: testInputs[test].match,
        timeout: apiTimeout,
      };

      return api.getFirstOrder(datasetId, params)
          .should.eventually.deep.equal(testOutputs[test]);
    });

    // Test [16]
    it("should return error for wrong field", function() {
      const test = 15;

      const api = new TDXApiStats(config);
      api.setShareKey(shareKeyID, shareKeySecret);
      const params = {
        type: testInputs[test].type,
        fields: testInputs[test].fields,
        match: testInputs[test].match,
        timeout: apiTimeout,
      };

      return api.getFirstOrder(datasetId, params)
          .should.eventually.deep.equal(testOutputs[test]);
    });

    // Test [17]
    it.only(`should return the minimum and sum of powers fields ${JSON.stringify(testInputs[0].fields)}`, function() {
      const test = 16;

      const api = new TDXApiStats(configNqm);
      api.setShareKey(shareKeyIDNqm, shareKeySecretNqm);
      const params = {
        type: testInputs[test].type,
        fields: testInputs[test].fields,
        match: testInputs[test].match,
        timeout: apiTimeout,
      };

      return api.getFirstOrder(datasetIdNqm, params)
          .should.eventually.deep.equal(testOutputs[test]);
    });
  });
});
