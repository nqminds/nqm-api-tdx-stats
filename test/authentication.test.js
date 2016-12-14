/* eslint-env mocha */

const chai = require("chai");
const chaiAsPromised = require("chai-as-promised");
const expect = chai.expect;
chai.use(chaiAsPromised);
chai.should();

const TDXApiStats = require("../lib/api.js");

const configNoToken = {
  "commandHost": "https://cmd.nq-m.com",
  "queryHost": "https://q.nq-m.com",
};

const configToken = {
  "commandHost": "https://cmd.nq-m.com",
  "queryHost": "https://q.nq-m.com",
  "accessToken": "12345",
};

const shareKeyID = "ryelV9N3mg";
const shareKeySecret = "root";

describe.skip("authentication.js", function() {
  describe("class creation", function() {
    it("should contain property setShareKey", function() {
      const api = new TDXApiStats(configNoToken);
      expect(api).to.have.property("setShareKey");
    });

    it("should contain property setToken", function() {
      const api = new TDXApiStats(configNoToken);
      expect(api).to.have.property("setToken");
    });
  });

  describe("property setting", function() {
    it("should set the token when setToken called", function() {
      const api = new TDXApiStats(configNoToken);
      api.setToken(configToken.accessToken);

      expect(api.config.accessToken).to.equal(configToken.accessToken);
    });

    it("should set the shareKey when setShareKey called", function() {
      const api = new TDXApiStats(configNoToken);
      api.setShareKey(shareKeyID, shareKeySecret);

      expect(api.shareKeyID).to.equal(shareKeyID);
      expect(shareKeySecret).to.equal(shareKeySecret);
    });
  });

  describe("authentication", function() {
    it("should set the access token", function() {
      const api = new TDXApiStats(configNoToken);
      api.setShareKey(shareKeyID, shareKeySecret);
      return api.authenticate().should.be.fulfilled;
    });

    it("should return error when key wrong", function() {
      const api = new TDXApiStats(configNoToken);
      api.setShareKey(shareKeyID, "");
      return api.authenticate().should.be.rejected;
    });

    it("should return when accessToken is already set", function() {
      const api = new TDXApiStats(configNoToken);
      api.setShareKey(shareKeyID, shareKeySecret);
      return api.authenticate()
        .then(api.authenticate)
        .should.be.fulfilled;
    });
  });
});
