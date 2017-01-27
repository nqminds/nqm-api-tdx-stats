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
  {
    match: {},
    field: "LotCode",
    binIndex: {
      type: "number",
      low: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19],
      upp: [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
    },
  }, // Test [6]
  {
    match: {},
    field: "BayCount",
    binIndex: {
      type: "number",
      count: 2,
      low: [],
      upp: [],
    },
  }, // Test [7]
  {
    match: {},
    field: "BayCount",
    binIndex: {
      type: "number",
      count: 23,
      low: [],
      upp: [],
    },
  }, // Test [8]
  {
    match: {},
    field: "LotCode",
    binIndex: {
      type: "number",
      low: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19],
      upp: [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
    },
  }, // Test [9]
  {
    match: {"BayType": "obility bays"},
    field: "BayCount",
    binIndex: {
      type: "number",
      low: [1, 10],
      upp: [10, 20],
    },
  }, // Test [10]
];

const testOutputs = [
  {
    count: 21,
    bins: [10, 10],
    binIndex: {
      type: "number",
      count: 2,
      low: [1, 10],
      upp: [10, 20],
    },
  }, // Test [1]
  {
    count: 21,
    bins: [20],
    binIndex: {
      type: "number",
      count: 1,
      low: [1],
      upp: [20],
    },
  }, // Test [2]
  {
    count: 21,
    bins: [],
    binIndex: {
      type: "number",
      count: 0,
      low: [],
      upp: [],
    },
  }, // Test [3]
  {
    count: 21,
    bins: [],
    binIndex: {
      type: "number",
      count: 0,
      low: [],
      upp: [],
    },
  }, // Test [4]
  {
    count: 3,
    bins: [3, 0],
    binIndex: {
      type: "number",
      count: 2,
      low: [1, 10],
      upp: [10, 20],
    },
  }, // Test [5]
  {
    count: 21,
    bins: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2],
    binIndex: {
      type: "number",
      count: 19,
      low: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19],
      upp: [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
    },
  }, // Test [6]
  {
    count: 21,
    bins: [12, 9],
    binIndex: {
      type: "number",
      count: 2,
      low: [2, 13.5],
      upp: [13.5, 25],
    },
  }, // Test [7]
  {
    count: 21,
    bins: [3, 3, 2, 0, 1, 0, 0, 1, 0, 1, 0, 1, 7, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1],
    binIndex: {
      type: "number",
      count: 23,
      low: [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24],
      upp: [3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25],
    },
  }, // Test [8]
  {
    count: 21,
    bins: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2],
    binIndex: {
      type: "number",
      count: 19,
      low: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19],
      upp: [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
    },
  }, // Test [9]
  {
    count: 0,
    bins: [],
    binIndex: {
      type: "number",
      count: 0,
      low: [],
      upp: [],
    },
  }, // Test [10]
];

const testTimeout = 20000;
const apiTimeout = 10000;

describe("second-order.js", function() {
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

  it(`should return the histogram for binIndex ${JSON.stringify(testInputs[5].binIndex)}`, function() {
    const test = 5;

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

  it(`should return the histogram for binIndex ${JSON.stringify(testInputs[6].binIndex)}`, function() {
    const test = 6;

    const api = new TDXApiStats(configNqm);
    api.setShareKey(shareKeyIDNqm, shareKeySecretNqm);

    const params = {
      match: testInputs[test].match,
      field: testInputs[test].field,
      binIndex: testInputs[test].binIndex,
      timeout: apiTimeout,
    };

    return api.getHistogram(datasetIdNqm, params)
        .should.eventually.deep.equal(testOutputs[test]);
  });

  it(`should return the histogram for binIndex ${JSON.stringify(testInputs[7].binIndex)}`, function() {
    const test = 7;

    const api = new TDXApiStats(configNqm);
    api.setShareKey(shareKeyIDNqm, shareKeySecretNqm);

    const params = {
      match: testInputs[test].match,
      field: testInputs[test].field,
      binIndex: testInputs[test].binIndex,
      timeout: apiTimeout,
    };

    return api.getHistogram(datasetIdNqm, params)
        .should.eventually.deep.equal(testOutputs[test]);
  });

  it(`should return the histogram for binIndex ${JSON.stringify(testInputs[8].binIndex)}`, function() {
    const test = 8;

    const api = new TDXApiStats(configNqm);
    api.setShareKey(shareKeyIDNqm, shareKeySecretNqm);

    const params = {
      match: testInputs[test].match,
      field: testInputs[test].field,
      binIndex: testInputs[test].binIndex,
      timeout: apiTimeout,
    };

    return api.getHistogram(datasetIdNqm, params)
        .should.eventually.deep.equal(testOutputs[test]);
  });

  it(`should return the histogram for binIndex ${JSON.stringify(testInputs[9].binIndex)}`, function() {
    const test = 9;

    const api = new TDXApiStats(configNqm);
    api.setShareKey(shareKeyIDNqm, shareKeySecretNqm);

    const params = {
      match: testInputs[test].match,
      field: testInputs[test].field,
      binIndex: testInputs[test].binIndex,
      timeout: apiTimeout,
    };

    return api.getHistogram(datasetIdNqm, params)
        .should.eventually.deep.equal(testOutputs[test]);
  });
});
