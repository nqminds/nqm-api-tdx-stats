/* eslint-env mocha */

const chai = require("chai");
const chaiAsPromised = require("chai-as-promised");
const Promise = require("bluebird");

chai.use(chaiAsPromised);
chai.should();

const TDXApiStats = require("../lib/api.js");

const configNqm = {
  "commandHost": "https://cmd.nq-m.com",
  "queryHost": "https://q.nq-m.com",
};

const shareKeyIDNqm = "ryelV9N3mg";
const shareKeySecretNqm = "root";

// Alexandru Mereacre/1 Test/MK Parking Locations
const datasetIdNqm = "Sygy_xBhml";

const testInputs = [
  {
    match: {},
    field: "BayCount",
    binIndex: {
      type: "number",
      low: [1, 10],
      upp: [10, 20],
    },
  }, // Test [1]
  {
    match: {},
    field: "BayCount",
    binIndex: {
      type: "number",
      low: [1],
      upp: [20],
    },
  }, // Test [2]
  {
    match: {},
    field: "BayCount",
    binIndex: {
      type: "number",
      low: [],
      upp: [],
    },
  }, // Test [3]
  {
    match: {},
    field: "",
    binIndex: {
      type: "number",
      low: [1],
      upp: [20],
    },
  }, // Test [4]
  {
    match: {"BayType": "Mobility bays"},
    field: "BayCount",
    binIndex: {
      type: "number",
      low: [1, 10],
      upp: [10, 20],
    },
  }, // Test [5]
];

const testOutputs = [
  {
    count: 21,
    bins: [10, 10],
    binIndex: {
      type: "number",
      low: [1, 10],
      upp: [10, 20],
    },
  }, // Test [1]
  {
    count: 21,
    bins: [20],
    binIndex: {
      type: "number",
      low: [1],
      upp: [20],
    },
  }, // Test [2]
  {
    count: 21,
    bins: [],
    binIndex: {
      type: "number",
      low: [],
      upp: [],
    },
  }, // Test [3]
  {
    count: 21,
    bins: [],
    binIndex: {
      type: "number",
      low: [1],
      upp: [20],
    },
  }, // Test [4]
  {
    count: 3,
    bins: [3, 0],
    binIndex: {
      type: "number",
      low: [1, 10],
      upp: [10, 20],
    },
  }, // Test [5]
];

const testTimeout = 20000;
const apiTimeout = 10000;

describe.only("second-order.js", function() {
  this.timeout(testTimeout);

  it(`should return the histogram for binIndex ${JSON.stringify(testInputs[0].binIndex)}`, function() {
    const test = 0;

    const api = new TDXApiStats(configNqm);
    api.setShareKey(shareKeyIDNqm, shareKeySecretNqm);

    const params = {
      match: testInputs[test].match,
      field: testInputs[test].field,
      binIndex: testInputs[test].binIndex,
      index: [],
      limit: 0,
      timeout: apiTimeout,
    };

    return api.getBasicBins(datasetIdNqm, params)
        .should.eventually.deep.equal(testOutputs[test]);
  });

  it(`should return the histogram for binIndex ${JSON.stringify(testInputs[1].binIndex)}`, function() {
    const test = 1;

    const api = new TDXApiStats(configNqm);
    api.setShareKey(shareKeyIDNqm, shareKeySecretNqm);

    const params = {
      match: testInputs[test].match,
      field: testInputs[test].field,
      binIndex: testInputs[test].binIndex,
      index: [],
      limit: 0,
      timeout: apiTimeout,
    };

    return api.getBasicBins(datasetIdNqm, params)
        .should.eventually.deep.equal(testOutputs[test]);
  });

  it(`should return the histogram for binIndex ${JSON.stringify(testInputs[2].binIndex)}`, function() {
    const test = 2;

    const api = new TDXApiStats(configNqm);
    api.setShareKey(shareKeyIDNqm, shareKeySecretNqm);

    const params = {
      match: testInputs[test].match,
      field: testInputs[test].field,
      binIndex: testInputs[test].binIndex,
      index: [],
      limit: 0,
      timeout: apiTimeout,
    };

    return api.getBasicBins(datasetIdNqm, params)
        .should.eventually.deep.equal(testOutputs[test]);
  });

  it(`should return the histogram for binIndex ${JSON.stringify(testInputs[3].binIndex)}`, function() {
    const test = 3;

    const api = new TDXApiStats(configNqm);
    api.setShareKey(shareKeyIDNqm, shareKeySecretNqm);

    const params = {
      match: testInputs[test].match,
      field: testInputs[test].field,
      binIndex: testInputs[test].binIndex,
      index: [],
      limit: 0,
      timeout: apiTimeout,
    };

    return api.getBasicBins(datasetIdNqm, params)
        .should.eventually.deep.equal(testOutputs[test]);
  });

  it(`should return the histogram for binIndex ${JSON.stringify(testInputs[4].binIndex)}`, function() {
    const test = 4;

    const api = new TDXApiStats(configNqm);
    api.setShareKey(shareKeyIDNqm, shareKeySecretNqm);

    const params = {
      match: testInputs[test].match,
      field: testInputs[test].field,
      binIndex: testInputs[test].binIndex,
      index: [],
      limit: 0,
      timeout: apiTimeout,
    };

    return api.getBasicBins(datasetIdNqm, params)
        .should.eventually.deep.equal(testOutputs[test]);
  });
});
