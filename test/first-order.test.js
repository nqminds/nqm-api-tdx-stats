/* eslint-env mocha */

const chai = require("chai");
const chaiAsPromised = require("chai-as-promised");
const Promise = require("bluebird");

chai.use(chaiAsPromised);
chai.should();

const constants = require("../lib/constants");
const TDXApiStats = require("../lib/api.js");

const configNqm = {
  "commandHost": "https://cmd.nq-m.com",
  "queryHost": "https://q.nq-m.com",
};

const shareKeyIDNqm = "ryelV9N3mg";
const shareKeySecretNqm = "root";
const datasetIdNqm = "Sygy_xBhml";

const config = {
  "commandHost": "https://cmd.nqminds.com",
  "queryHost": "https://q.nqminds.com",
};

const shareKeyID = "Syl5oSTRme";
const shareKeySecret = "root";

// Educational achievements from Toby's nqminds account'
const datasetId = "VyZFr8hWzg";
const testFieldOne = "ecode";
const testFieldTwo = "rate";
const match = {"name": "Surrey"};
const testOutputs = [
  {1: 201},
  {1: 201, 2: 0},
  {1: 936, 2: 30},
  {},
  {1: {"$min": 0, "$max": 0, "$avg": 613.58}, 2: {"$min": 0, "$max": 0, "$avg": 63.42}},
];
const apiTimeout = 1000;

describe("first-order.js", function() {
  describe(`for test dataset: ${datasetId}`, function() {
    it(`[1] should return the minimum for the field ${testFieldOne}`, function() {
      const api = new TDXApiStats(config);
      api.setShareKey(shareKeyID, shareKeySecret);
      return api.getFirstOrder(["$min"], datasetId, null, [testFieldOne], apiTimeout)
          .then((val) => {
            return Promise.resolve({1: val[testFieldOne]["$min"]});
          })
          .should.eventually.equal(testOutputs[0]);
    });

    it(`[2] should return the minimum for the field ${testFieldOne} and ${testFieldTwo}`, function() {
      const api = new TDXApiStats(config);
      api.setShareKey(shareKeyID, shareKeySecret);
      return api.getFirstOrder(["$min"], datasetId, null, [testFieldOne, testFieldTwo], apiTimeout)
          .then((val) => {
            return Promise.resolve({1: val[testFieldOne]["$min"], 2: val[testFieldTwo]["$min"]});
          })
      .should.eventually.deep.equal(testOutputs[1]);
    });

    it(`[3] should return the minimum for the field ${testFieldOne} and ${testFieldOne} with the match ${JSON.stringify(match)}`, function() {
      const api = new TDXApiStats(config);

      api.setShareKey(shareKeyID, shareKeySecret);
      return api.getFirstOrder(["$min"], datasetId, match, [testFieldOne, testFieldTwo], apiTimeout)
          .then((val) => {
            return Promise.resolve({1: val[testFieldOne]["$min"], 2: val[testFieldTwo]["$min"]});
          })
      .should.eventually.deep.equal(testOutputs[2]);
    });

    it("[4] should timeout", function() {
      // set the minimum timeout
      const timeout = 1;
      const api = new TDXApiStats(config);
      api.setShareKey(shareKeyID, shareKeySecret);
      return api.getFirstOrder(["$min"], datasetId, null, [testFieldOne], timeout)
              .should.be.rejected;
    });

    it("[5] should return the min, max and avg for the field ${testFieldOne} and ${testFieldOne}", function() {
      const api = new TDXApiStats(config);
      api.setShareKey(shareKeyID, shareKeySecret);
      return api.getFirstOrder(["$min", "$max", "$avg"], datasetId, null, [testFieldOne, testFieldTwo], apiTimeout)
          .then((val) => {
            val[testFieldOne]["$avg"] = val[testFieldOne]["$avg"].toFixed(2);
            val[testFieldTwo]["$avg"] = val[testFieldTwo]["$avg"].toFixed(2); 
            return Promise.resolve({1: val[testFieldOne], 2: val[testFieldTwo]});
          })
      .should.eventually.deep.equal(testOutputs[4]);
    });
  });
});
