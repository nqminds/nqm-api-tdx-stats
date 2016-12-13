/* eslint-env mocha */

const chai = require("chai");
const chaiAsPromised = require("chai-as-promised");
const Promise = require("bluebird");

chai.use(chaiAsPromised);
chai.should();

const constants = require("../lib/constants");
const TDXApiStats = require("../lib/api.js");

const config = {
  "commandHost": "https://cmd.nq-m.com",
  "queryHost": "https://q.nq-m.com",
};

const shareKeyID = "ryelV9N3mg";
const shareKeySecret = "root";
const datasetId = "Sygy_xBhml";

describe("first-order.js", function() {
  describe("for test dataset MK Parking Locations", function() {
    it("should return the minimum for the field LotCode", function() {
      const api = new TDXApiStats(config);
      api.setShareKey(shareKeyID, shareKeySecret);
      return api.getMin(datasetId, null, ["LotCode"])
          .then((val) => {
            return Promise.resolve(val.data[0].LotCode);
          })
      .should.eventually.equal(1);
    });

    it("should return the minimum for the field LotCode and BayCount", function() {
      const api = new TDXApiStats(config);
      api.setShareKey(shareKeyID, shareKeySecret);
      return api.getMin(datasetId, null, ["LotCode", "BayCount"])
          .then((val) => {
            return Promise.resolve({1: val.data[0].LotCode, 2: val.data[0].BayCount});
          })
      .should.eventually.deep.equal({1: 1, 2: 2});
    });

    it("should return the minimum for the field LotCode and BayCount with the match BayType=Public", function() {
      const api = new TDXApiStats(config);
      const match = {"BayType": "Public"};

      api.setShareKey(shareKeyID, shareKeySecret);
      return api.getMin(datasetId, match, ["LotCode", "BayCount"])
          .then((val) => {
            return Promise.resolve({1: val.data[0].LotCode, 2: val.data[0].BayCount});
          })
      .should.eventually.deep.equal({1: 2, 2: 2});
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
