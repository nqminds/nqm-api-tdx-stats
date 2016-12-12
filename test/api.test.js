/* eslint-env mocha */

const chai = require("chai");
const expect = chai.expect;

const TDXApiStats = require("../lib/api.js");
const configNoToken = {
  "commandHost": "https://cmd.nq-m.com",
  "queryHost": "https://q.nq-m.com",
  "shareKeyID": "ryelV9N3mg",
  "shareKeySecret": "root",
};

const configToken = {
  "commandHost": "https://cmd.nq-m.com",
  "queryHost": "https://q.nq-m.com",
  "accessToken": "12345",
  "shareKeyID": "ryelV9N3mg",
  "shareKeySecret": "root",
};

const datasetId = "Sylbgv671l";

describe("api.js", function() {
  describe("class creation", function() {
    it("should contain property getMin", function() {
      const api = new TDXApiStats(configNoToken);
      expect(api).to.have.property("getMin");
    });

    it("should contain property getMax", function() {
      const api = new TDXApiStats(configNoToken);
      expect(api).to.have.property("getMax");
    });
  });
});
