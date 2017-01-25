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
];

const testOutputs = [
  {
    count: 21,
    bins: [10, 10],
  }, // Test [1]
];

const testTimeout = 20000;
const apiTimeout = 10000;

describe.only("second-order.js", function() {
  this.timeout(testTimeout);

  it(`should return the histogram for binIndex ${testInputs[0].binIndex}`, function() {
    const test = 0;

    const api = new TDXApiStats(configNqm);
    api.setShareKey(shareKeyIDNqm, shareKeySecretNqm);

    const params = {
      match: testInputs[test].match,
      fields: testInputs[test].field,
      binIndex: testInputs[test].binIndex,
      index: [],
      limit: 0,
      timeout: apiTimeout,
    };

    return api.getBasicBins(datasetIdNqm, params)
        .should.eventually.deep.equal(testOutputs[test]);
  });
});
