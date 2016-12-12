/* eslint-env mocha */

const chai = require("chai");
const expect = chai.expect;

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

describe("authentication.js", function() {
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
      api.setToken(configToken.accessToken);
      expect(api.config.accessToken).to.equal(configToken.accessToken);
    });
  });
});
