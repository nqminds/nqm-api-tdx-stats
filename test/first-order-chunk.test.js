/* eslint-env mocha */
"use strict";

const chai = require("chai");
const chaiAsPromised = require("chai-as-promised");
const Promise = require("bluebird");

chai.use(chaiAsPromised);
chai.should();

const TDXApiStats = require("../lib/api.js");

const config = {
  "commandHost": "https://cmd.nqminds.com",
  "queryHost": "https://q.nqminds.com",
  "searchLimit": 10,
};

const shareKeyID = "Syl5oSTRme";
const shareKeySecret = "root";

// Educational achievements from Toby's nqminds account'
// const datasetId = "VyZFr8hWzg";

// Leo Valberg: hcc waste/cost-output
const datasetId = "HygxXEFSB";

const testInputs = [
  {type: ["$min"], match: {}, fields: ["Friday"], index: []},                                    // Test [1]
  {type: ["$max"], match: {"$and": [{"SID": "2021"}, {"Waste_Type": "WOODMX"}, {"HWRC": "Winchester"}]}, fields: ["Friday"], index: ["SID", "HWRC", "Waste_Type", "NID", "Contract", "First_Movement"]},
  {type: ["$max"], match: {"$and": [{"SID": "2021"}, {"Waste_Type": "WOODMX"}, {"HWRC": "Winchester"}]}, fields: ["Friday"], index: ["SID", "HWRC", "Waste_Type", "NID", "Contract", "First_Movement"]},
  {type: ["$max"], match: {"$and": [{"SID": "2021"}, {"Waste_Type": "WOODMX"}, {"HWRC": "Winchester"}]}, fields: ["Friday"], index: ["SID", "HWRC", "Waste_Type", "NID", "Contract", "First_Movement"]},
];

const testOutputs = [
  {                       // Test [1]
    count: 27520,
    Friday: {
      "$min": 0,
    },
  },
  {                       // Test [2]
    count: config.searchLimit,
    Friday: {
      "$max": 93.18,
    },
  },
  {                       // Test [3]
    count: config.searchLimit,
    Friday: {
      "$max": 93.16,
    },
  },
  {                       // Test [4]
    done: false,
    searchCount: 20,
  },  
];

const testTimeout = 6000;
const apiTimeout = 1000;

describe("first-order-chunk.js", function() {
  this.timeout(testTimeout);

  describe(`for test dataset: ${datasetId}`, function() {
    // Test [1]
    it(`should return getFirstOrder for index ${JSON.stringify(testInputs[0].index)}`, function() {
      const test = 0;

      const api = new TDXApiStats(config);
      api.setShareKey(shareKeyID, shareKeySecret);
      return api.getFirstOrderChunk(testInputs[test].type, datasetId, null, testInputs[test].fields, testInputs[test].index, apiTimeout)
          .then((iterator) => {
            return iterator.next();
          })
          .then((val) => {
            return Promise.resolve(val);
          })
          .should.eventually.deep.equal(testOutputs[test]);
    });

    // Test [2]
    it(`should return getFirstOrder for index ${JSON.stringify(testInputs[1].index)}`, function() {
      const test = 1;

      const api = new TDXApiStats(config);
      api.setShareKey(shareKeyID, shareKeySecret);
      return api.getFirstOrderChunk(testInputs[test].type, datasetId, testInputs[test].match, testInputs[test].fields, testInputs[test].index, apiTimeout)
          .then((iterator) => {
            return iterator.next();
          })
          .then((val) => {
            return Promise.resolve(val);
          })
          .should.eventually.deep.equal(testOutputs[test]);
    });

    // Test [3]
    it(`should return getFirstOrder for index ${JSON.stringify(testInputs[2].index)}`, function() {
      const test = 2;
      let iterator;
      const api = new TDXApiStats(config);
      api.setShareKey(shareKeyID, shareKeySecret);
      return api.getFirstOrderChunk(testInputs[test].type, datasetId, testInputs[test].match, testInputs[test].fields, testInputs[test].index, apiTimeout)
          .then((valIterator) => {
            iterator = valIterator;
            return iterator.next();
          })
          .then((val) => {
            return Promise.resolve(val);
          })
          .then((val) => {
            return iterator.next();
          })
          .then((val) => {
            return Promise.resolve(val);
          })
          .should.eventually.deep.equal(testOutputs[test]);
    });

    // Test [4]
    it(`should return getFirstOrder for index ${JSON.stringify(testInputs[3].index)}`, function() {
      const test = 3;
      let iterator;
      const api = new TDXApiStats(config);
      api.setShareKey(shareKeyID, shareKeySecret);
      return api.getFirstOrderChunk(testInputs[test].type, datasetId, testInputs[test].match, testInputs[test].fields, testInputs[test].index, apiTimeout)
          .then((valIterator) => {
            iterator = valIterator;
            return iterator.next();
          })
          .then((val) => {
            return Promise.resolve(val);
          })
          .then((val) => {
            return iterator.next();
          })
          .then((val) => {
            return Promise.resolve({done: iterator._done, searchCount: iterator._internalParams.searchCount});
          })
          .should.eventually.deep.equal(testOutputs[test]);
    });    
  });
});
