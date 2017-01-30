/* eslint-env mocha */
"use strict";

const chai = require("chai");
const chaiAsPromised = require("chai-as-promised");
const Promise = require("bluebird");

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
    match: {},
    field: "SID",
  }, // Test [1]
];

const testOutputs = [
  {
    SID: ["2015"],
  }, // Test [1]
];

const testTimeout = 20000;
const apiTimeout = 10000;

describe.only("first-order-indexed.js", function() {
  this.timeout(testTimeout);

  it(`should return the minimum for the field ${JSON.stringify(testInputs[0])}`, function() {
    const test = 0;

    const api = new TDXApiStats(config);
    api.setShareKey(shareKeyID, shareKeySecret);
    const params = {
      match: testInputs[test].match,
      field: testInputs[test].field,
      timeout: apiTimeout,
    };

    return api.getMinIndexed(datasetId, params)
          .should.eventually.deep.equal(testOutputs[test]);
  });
});

