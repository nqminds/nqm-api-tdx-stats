/* eslint-env mocha */
"use strict";

const chai = require("chai");
const chaiAsPromised = require("chai-as-promised");

chai.use(chaiAsPromised);
chai.should();

const TDXApiStats = require("../lib/api.js");

const config = {
  "commandHost": "https://cmd.nq-m.com",
  "queryHost": "https://q.nq-m.com",
};

const shareKeyID = "ryelV9N3mg";
const shareKeySecret = "root";

// Alexandru Mereacre: Test 1/cost-output
const datasetId = "rklWhQU0Ue";

const testInputs = [
  {
    match: {"$and": [{"SID": "2021"}, {"Waste_Type": "WOODMX"}, {"HWRC": "Winchester"}]},
    field: "Saturday",
    binIndex: {
      type: "number",
      count: 10,
      low: [],
      upp: [],
    },
  }, // Test [1]
  {
    match: {"$and": [{"SID": "2021"}, {"Waste_Type": "WOODMX"}, {"HWRC": "Winchester"}]},
    field: "Saturday",
    binIndex: {
      type: "number",
      count: 1,
      low: [],
      upp: [],
    },
  }, // Test [2]
  {
    match: {"$and": [{"SID": "2021"}, {"Waste_Type": "WOODMX"}, {"HWRC": "Winchester"}]},
    field: "Satturday",
    binIndex: {
      type: "number",
      count: 1,
      low: [],
      upp: [],
    },
  }, // Test [3]
  {
    match: {"$and": [{"SID": "2021"}, {"Waste_Type": "WOODMX"}, {"HWRC": "Winchester"}]},
    field: "Friday",
    binIndex: {
      type: "number",
      low: [0.41, 9.687000000000001, 18.964000000000002, 28.241000000000003, 37.518, 46.795, 56.072, 65.349, 74.626, 83.903],
      upp: [9.687000000000001, 18.964000000000002, 28.241000000000003, 37.518, 46.795, 56.072, 65.349, 74.626, 83.903, 93.18],
    },
  }, // Test [4]
];

const testOutputs = [
  {
    count: 50,
    bins: [30, 0, 0, 10, 0, 0, 0, 0, 0, 10],
    binIndex: {
      type: "number",
      count: 10,
      low: [0.41, 9.687000000000001, 18.964000000000002, 28.241000000000003, 37.518, 46.795, 56.072, 65.349, 74.626, 83.903],
      upp: [9.687000000000001, 18.964000000000002, 28.241000000000003, 37.518, 46.795, 56.072, 65.349, 74.626, 83.903, 93.18],
    },
  }, // Test [1]
  {
    count: 50,
    bins: [50],
    binIndex: {
      type: "number",
      count: 1,
      low: [0.41],
      upp: [93.18],
    },
  }, // Test [2]
  {
  }, // Test [3]
  {
    count: 50,
    bins: [30, 0, 0, 10, 0, 0, 0, 0, 0, 10],
    binIndex: {
      type: "number",
      count: 10,
      low: [0.41, 9.687000000000001, 18.964000000000002, 28.241000000000003, 37.518, 46.795, 56.072, 65.349, 74.626, 83.903],
      upp: [9.687000000000001, 18.964000000000002, 28.241000000000003, 37.518, 46.795, 56.072, 65.349, 74.626, 83.903, 93.18],
    },
  }, // Test [4]
];

const testTimeout = 20000;
const apiTimeout = 10000;

describe.only("second-order-indexed.js", function() {
  this.timeout(testTimeout);

  it(`should return the histogram for binIndex ${JSON.stringify(testInputs[0].binIndex)}`, function() {
    const test = 0;

    const api = new TDXApiStats(config);
    api.setShareKey(shareKeyID, shareKeySecret);

    const params = {
      match: testInputs[test].match,
      field: testInputs[test].field,
      binIndex: testInputs[test].binIndex,
      timeout: apiTimeout,
    };

    return api.getHistogramIndexed(datasetId, params)
        .should.eventually.deep.equal(testOutputs[test]);
  });

  it(`should return the histogram for binIndex ${JSON.stringify(testInputs[1].binIndex)}`, function() {
    const test = 1;

    const api = new TDXApiStats(config);
    api.setShareKey(shareKeyID, shareKeySecret);

    const params = {
      match: testInputs[test].match,
      field: testInputs[test].field,
      binIndex: testInputs[test].binIndex,
      timeout: apiTimeout,
    };

    return api.getHistogramIndexed(datasetId, params)
        .should.eventually.deep.equal(testOutputs[test]);
  });

  it(`should return the histogram for binIndex ${JSON.stringify(testInputs[2].binIndex)}`, function() {
    const test = 2;

    const api = new TDXApiStats(config);
    api.setShareKey(shareKeyID, shareKeySecret);

    const params = {
      match: testInputs[test].match,
      field: testInputs[test].field,
      binIndex: testInputs[test].binIndex,
      timeout: apiTimeout,
    };

    return api.getHistogramIndexed(datasetId, params)
        .should.be.rejected;
  });

  it(`should return the histogram for binIndex ${JSON.stringify(testInputs[3].binIndex)}`, function() {
    const test = 3;

    const api = new TDXApiStats(config);
    api.setShareKey(shareKeyID, shareKeySecret);

    const params = {
      match: testInputs[test].match,
      field: testInputs[test].field,
      binIndex: testInputs[test].binIndex,
      timeout: apiTimeout,
    };

    return api.getHistogramIndexed(datasetId, params)
        .should.eventually.deep.equal(testOutputs[test]);
  });
});
