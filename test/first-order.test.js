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
const valueMinFieldOne = 201;
const valueMinFieldTwo = 0;
const match = {"name": "Surrey"};
const matchMinFieldOne = 936;
const matchMinFieldTwo = 30;

describe("first-order.js", function() {
  describe(`for test dataset: ${datasetId}`, function() {
    it(`should return the minimum for the field ${testFieldOne}`, function() {
      const api = new TDXApiStats(config);
      api.setShareKey(shareKeyID, shareKeySecret);
      return api.getMin(datasetId, null, [testFieldOne])
          .then((val) => {
            return Promise.resolve(val.data[0][testFieldOne]);
          })
      .should.eventually.equal(valueMinFieldOne);
    });

    it(`should return the minimum for the field ${testFieldOne} and ${testFieldTwo}`, function() {
      const api = new TDXApiStats(config);
      api.setShareKey(shareKeyID, shareKeySecret);
      return api.getMin(datasetId, null, [testFieldOne, testFieldTwo])
          .then((val) => {
            return Promise.resolve({1: val.data[0][testFieldOne], 2: val.data[0][testFieldTwo]});
          })
      .should.eventually.deep.equal({1: valueMinFieldOne, 2: valueMinFieldTwo});
    });

    it(`should return the minimum for the field ${testFieldOne} and ${testFieldOne} with the match ${JSON.stringify(match)}`, function() {
      const api = new TDXApiStats(config);

      api.setShareKey(shareKeyID, shareKeySecret);
      return api.getMin(datasetId, match, [testFieldOne, testFieldTwo])
          .then((val) => {
            return Promise.resolve({1: val.data[0][testFieldOne], 2: val.data[0][testFieldTwo]});
          })
      .should.eventually.deep.equal({1: matchMinFieldOne, 2: matchMinFieldTwo});
    });

    it("should timeout", function() {
      // set the minimum timeout
      const timeout = 1;
      const api = new TDXApiStats(config);
      api.setShareKey(shareKeyID, shareKeySecret);
      return api.getMin(datasetId, null, ["LotCode"], 1)
          .then((val) => {
            return Promise.resolve(val.data[0].LotCode);
          })
      .should.be.rejected;
    });
  });
});
