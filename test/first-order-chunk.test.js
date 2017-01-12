/* eslint-env mocha */

const chai = require("chai");
const chaiAsPromised = require("chai-as-promised");
const Promise = require("bluebird");

chai.use(chaiAsPromised);
chai.should();

const TDXApiStats = require("../lib/api.js");

const config = {
  "commandHost": "https://cmd.nqminds.com",
  "queryHost": "https://q.nqminds.com",
};

const shareKeyID = "Syl5oSTRme";
const shareKeySecret = "root";

// Educational achievements from Toby's nqminds account'
// const datasetId = "VyZFr8hWzg";

// Leo Valberg: hcc waste/cost-output
const datasetId = "HygxXEFSB";

const testInputs = [
  {type: ["$min"], match: {}, fields: ["Friday"], index: []},                                    // Test [1]
  {type: ["$max"], match: {"$and": [{"SID": "2021"}, {"NID": "11111111111111111111111111"}, {"Contract": "Non_Contract"}, {"First_Movement": "HURN WOOD TRANSFER"}]}, fields: ["Friday"], index: ["SID", "HWRC", "Waste_Type", "NID", "Contract", "First_Movement"]},
];

// const datasetId = "SkephVW8t";
// const testInputs = [
//   {type: ["$min"], match: {}, fields: ["type"], index: []},                                    // Test [1]
//   {type: ["$min"], match: {}, fields: ["type"], index: ["timestamp"]},
// ];

const testOutputs = [
  {                       // Test [1]
    count: 27520,
    Friday: {
      "$min": 0,
    },
  },
  {                       // Test [2]
    count: 17,
    Friday: {
      "$avg": 0,
    },
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
  });
});
