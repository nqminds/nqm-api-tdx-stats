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
    match: {"SID": "2021", "Contract": "Contract", "Waste_Type": "GREEN AM", "First_Movement": "CHILBOLTON COMPOSTING SITE"},
    field: "Saturday",
  }, // Test [1]
  {
    match: {"SID": "2021", "Contract": "Contract", "Waste_Type": "GREEN AM", "First_Movement": "CHILBOLTON COMPOSTING SITE"},
    field: "Satturday",
  }, // Test [2]
  {
    match: {},
    field: "Saturday",
  }, // Test [3]
  {
    match: {"SID": "2021", "Contract": "Contract", "Waste_Type": "GREEN AM", "First_Movement": "CHILBOLTON COMPOSTING SITE"},
    field: "Saturday",
  }, // Test [4]
];

const testOutputs = [
  {
    Saturday: [0],
  }, // Test [1]
  {
    Satturday: [null],
  }, // Test [2]
  {
    Saturday: [0],
  }, // Test [3]
  {
    Saturday: [356.87],
  }, // Test [4]
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

  it(`should return the minimum for the field ${JSON.stringify(testInputs[1])}`, function() {
    const test = 1;

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

  it(`should return the minimum for the field ${JSON.stringify(testInputs[2])}`, function() {
    const test = 2;

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

  it(`should return the minimum for the field ${JSON.stringify(testInputs[3])}`, function() {
    const test = 3;

    const api = new TDXApiStats(config);
    api.setShareKey(shareKeyID, shareKeySecret);
    const params = {
      match: testInputs[test].match,
      field: testInputs[test].field,
      timeout: apiTimeout,
    };

    return api.getMaxIndexed(datasetId, params)
          .should.eventually.deep.equal(testOutputs[test]);
  });
});

