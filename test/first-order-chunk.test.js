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
  {type: ["$min"], match: {"SID": "2021", "Waste_Type": "WOODMX", "Contract": "Non_Contract"}, fields: ["Friday"], index: []},                                    // Test [1]
];

const testOutputs = [
  {                       // Test [1]
    count: 27520,
    Friday: {
      "$min": 0,
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
            return iterator.next().value;
          })
          .then((val) => {
            return Promise.resolve(val);
          })
          .should.eventually.deep.equal(testOutputs[test]);
    });
  });
});
