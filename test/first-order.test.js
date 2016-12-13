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
            return Promise.resolve(val.data[0][constants.countFieldName]);
          })
      .should.eventually.equal(21);
    });
  });
});
