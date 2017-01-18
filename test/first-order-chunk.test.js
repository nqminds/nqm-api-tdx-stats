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
  "chunkSize": 2,
};

const shareKeyID = "Syl5oSTRme";
const shareKeySecret = "root";

// Educational achievements from Toby's nqminds account'
// const datasetId = "VyZFr8hWzg";

// Leo Valberg: hcc waste/cost-output
const datasetId = "HygxXEFSB";

const testInputs = [
  {type: ["$min"], chunkSize: 0, match: {}, fields: ["Friday"], index: []},                                    // Test [1]
  {type: ["$max"], chunkSize: 10, match: {"$and": [{"SID": "2021"}, {"Waste_Type": "WOODMX"}, {"HWRC": "Winchester"}]}, fields: ["Friday"], index: ["SID", "HWRC", "Waste_Type", "NID", "Contract", "First_Movement"]},
  {type: ["$max"], chunkSize: 20, match: {"$and": [{"SID": "2021"}, {"Waste_Type": "WOODMX"}, {"HWRC": "Winchester"}]}, fields: ["Friday"], index: ["SID", "HWRC", "Waste_Type", "NID", "Contract", "First_Movement"]},
  {type: ["$max"], chunkSize: 20, match: {"$and": [{"SID": "2021"}, {"Waste_Type": "WOODMX"}, {"HWRC": "Winchester"}]}, fields: ["Friday"], index: ["SID", "HWRC", "Waste_Type", "NID", "Contract", "First_Movement"]},
  {type: ["$avg"], chunkSize: 20, match: {"$and": [{"SID": "2021"}, {"Waste_Type": "WOODMX"}, {"HWRC": "Winchester"}]}, fields: ["Friday"], index: ["SID", "HWRC", "Waste_Type", "NID", "Contract", "First_Movement"]},
  {type: ["$avg"], chunkSize: 20, match: {"$and": [{"SID": "2021"}, {"Waste_Type": "WOODMX"}, {"HWRC": "Winchester"}]}, fields: ["Friday"], index: ["SID", "HWRC", "Waste_Type", "NID", "Contract", "First_Movement"]},
  {type: [], chunkSize: 20, match: {"$and": [{"SID": "2021"}, {"Waste_Type": "WOODMX"}, {"HWRC": "Winchester"}]}, fields: ["Friday"], index: ["SID", "HWRC", "Waste_Type", "NID", "Contract", "First_Movement"]},
  {type: [], chunkSize: 20, match: {"$and": [{"SID": "2021"}, {"Waste_Type": "WOODMX"}, {"HWRC": "Winchester"}]}, fields: ["Friday"], index: ["SID", "HWRC", "Waste_Type", "NID", "Contract", "First_Movement"]},
  {type: ["$min"], chunkSize: 0, match: {"$and": [{"SID": "2021"}, {"Waste_Type": "WOODMX"}, {"HWRC": "Winchester"}]}, fields: ["Friday"], index: ["SID", "HWRC", "Waste_Type", "NID", "Contract", "First_Movement"]},
  {type: ["$min"], chunkSize: 0, match: {"$and": [{"SID": "2021"}, {"Waste_Type": "WOODMX"}, {"HWRC": "Winchester"}]}, fields: ["Friday"], index: ["SID", "HWRC", "Waste_Type", "NID", "Contract", "First_Movement"]},
  {type: ["$min"], chunkSize: 20, match: {"$and": [{"SID": "20212"}, {"Waste_Type": "WOODMX"}, {"HWRC": "Winchester"}]}, fields: ["Friday"], index: ["SID", "HWRC", "Waste_Type", "NID", "Contract", "First_Movement"]},
  {type: ["$min"], chunkSize: 20, match: {"$and": [{"SID": "20212"}, {"Waste_Type": "WOODMX"}, {"HWRC": "Winchester"}]}, fields: ["Friday"], index: ["SID", "HWRC", "Waste_Type", "NID", "Contract", "First_Movement"]},
  {type: ["$min"], chunkSize: 20, match: {"$and": [{"SID": "2021"}, {"Waste_Type": "WOODMX"}, {"HWRC": "Winchester"}]}, fields: ["Friday"], index: ["SSID", "HHWRC", "Waste_Type", "NNID", "Contract", "First_Movement"]},
];

const testOutputs = [
  {                       // Test [1]
    count: 27520,
    Friday: {
      "$min": 0,
    },
  },
  {                       // Test [2]
    count: 10,
    Friday: {
      "$max": 93.18,
    },
  },
  {                       // Test [3]
    count: 20,
    Friday: {
      "$max": 93.16,
    },
  },
  {                       // Test [4]
    done: false,
    iterationNumber: 2,
  },
  {                       // Test [5]
    count: 50,
    Friday: {
      "$avg": 25.2672,
    },
  },
  {                       // Test [6]
    count: 50,
    Friday: {
      "$avg": 25.2672,
    },
  },
  {                       // Test [7]
    count: 50,
  },
  {                       // Test [8]
    count: 50,
  },
  {                       // Test [9]
    count: 50,
    Friday: {
      "$min": 0.41,
    },
  },
  {                       // Test [10]
    count: 50,
    Friday: {
      "$min": 0.41,
    },
  },
  {                       // Test [11]
    count: 0,
  },
  {                       // Test [12]
    count: 0,
  },
  {                       // Test [13]
    count: 50,
    Friday: {
      "$avg": 25.2672,
    },
  },
];

const testTimeout = 32000;
const apiTimeout = 10000;

describe("first-order-chunk.js", function() {
  this.timeout(testTimeout);

  describe(`for test dataset: ${datasetId}`, function() {
    // Test [1]
    it(`should return getFirstOrderIterator for index ${JSON.stringify(testInputs[0].index)}`, function() {
      const test = 0;

      const api = new TDXApiStats(config);
      api.setShareKey(shareKeyID, shareKeySecret);
      const params = {
        type: testInputs[test].type,
        match: testInputs[test].match,
        fields: testInputs[test].fields,
        index: testInputs[test].index,
        chunkSize: testInputs[test].chunkSize,
        timeout: apiTimeout,
      };

      return api.getFirstOrderIterator(datasetId, params)
          .then((iterator) => {
            return iterator.next();
          })
          .should.eventually.deep.equal(testOutputs[test]);
    });

    // Test [2]
    it(`should return getFirstOrderIterator for index ${JSON.stringify(testInputs[1].index)}`, function() {
      const test = 1;

      const api = new TDXApiStats(config);
      api.setShareKey(shareKeyID, shareKeySecret);
      const params = {
        type: testInputs[test].type,
        match: testInputs[test].match,
        fields: testInputs[test].fields,
        index: testInputs[test].index,
        chunkSize: testInputs[test].chunkSize,
        timeout: apiTimeout,
      };

      return api.getFirstOrderIterator(datasetId, params)
          .then((iterator) => {
            return iterator.next();
          })
          .should.eventually.deep.equal(testOutputs[test]);
    });

    // Test [3]
    it(`should return getFirstOrderIterator for index ${JSON.stringify(testInputs[2].index)}`, function() {
      const test = 2;
      let iterator;
      const api = new TDXApiStats(config);
      api.setShareKey(shareKeyID, shareKeySecret);
      const params = {
        type: testInputs[test].type,
        match: testInputs[test].match,
        fields: testInputs[test].fields,
        index: testInputs[test].index,
        chunkSize: testInputs[test].chunkSize,
        timeout: apiTimeout,
      };

      return api.getFirstOrderIterator(datasetId, params)
          .then((valIterator) => {
            iterator = valIterator;
            return iterator.next();
          })
          .then((val) => {
            return iterator.next();
          })
          .should.eventually.deep.equal(testOutputs[test]);
    });

    // Test [4]
    it(`should return getFirstOrderIterator for index ${JSON.stringify(testInputs[3].index)}`, function() {
      const test = 3;
      let iterator;
      const api = new TDXApiStats(config);
      api.setShareKey(shareKeyID, shareKeySecret);
      const params = {
        type: testInputs[test].type,
        match: testInputs[test].match,
        fields: testInputs[test].fields,
        index: testInputs[test].index,
        chunkSize: testInputs[test].chunkSize,
        timeout: apiTimeout,
      };

      return api.getFirstOrderIterator(datasetId, params)
          .then((valIterator) => {
            iterator = valIterator;
            return iterator.next();
          })
          .then((val) => {
            return iterator.next();
          })
          .then((val) => {
            return Promise.resolve({done: iterator._done, iterationNumber: iterator._internalParams.iterationNumber});
          })
          .should.eventually.deep.equal(testOutputs[test]);
    });

    // Test [5]
    it(`should return getFirstOrderIterator for index ${JSON.stringify(testInputs[4].index)}`, function() {
      const test = 4;
      const api = new TDXApiStats(config);
      const initOutput = {count: 0, Friday: {"$avg": 0}};

      api.setShareKey(shareKeyID, shareKeySecret);
      const params = {
        type: testInputs[test].type,
        match: testInputs[test].match,
        fields: testInputs[test].fields,
        index: testInputs[test].index,
        chunkSize: testInputs[test].chunkSize,
        timeout: apiTimeout,
      };

      return api.getFirstOrderIterator(datasetId, params)
              .then((iterator) => {
                const iterList = Array.from(new Array(iterator.getInternalParam("totalIterations")), (val, index) => index + 1);
                return Promise.reduce(iterList, (out) => {
                  return iterator.next().then((val) => {
                    const totalCount = parseFloat(iterator.getInternalParam("totalCount"));
                    out.count += val.count;
                    out.Friday["$avg"] += val.Friday["$avg"] * (parseFloat(val.count) / totalCount);
                    return out;
                  });
                }, initOutput);
              })
          .should.eventually.deep.equal(testOutputs[test]);
    });

    // Test [6]
    it(`should return getFirstOrderChunk for index ${JSON.stringify(testInputs[5].index)}`, function() {
      const test = 5;
      const api = new TDXApiStats(config);
      const init = {count: 0, Friday: {"$avg": 0}};

      api.setShareKey(shareKeyID, shareKeySecret);
      const params = {
        type: testInputs[test].type,
        match: testInputs[test].match,
        fields: testInputs[test].fields,
        index: testInputs[test].index,
        chunkSize: testInputs[test].chunkSize,
        timeout: apiTimeout,
      };

      const processChunk = function(input, output, iterator) {
        const totalCount = parseFloat(iterator.getInternalParam("totalCount"));
        output.count += input.count;
        output.Friday["$avg"] += input.Friday["$avg"] * (parseFloat(input.count) / totalCount);
        return output;
      };

      return api.getFirstOrderChunk(datasetId, params, processChunk, init)
          .should.eventually.deep.equal(testOutputs[test]);
    });

    // Test [7]
    it("should return just the count for empty type", function() {
      const test = 6;
      const api = new TDXApiStats(config);

      api.setShareKey(shareKeyID, shareKeySecret);
      const params = {
        type: testInputs[test].type,
        match: testInputs[test].match,
        fields: testInputs[test].fields,
        index: testInputs[test].index,
        chunkSize: testInputs[test].chunkSize,
        timeout: apiTimeout,
      };

      return api.getFirstOrderIterator(datasetId, params)
          .then((iterator) => {
            return iterator.next();
          })
          .should.eventually.deep.equal(testOutputs[test]);
    });

    // Test [8]
    it("should return just the count for empty type", function() {
      const test = 7;
      const api = new TDXApiStats(config);
      const init = {count: 0};

      api.setShareKey(shareKeyID, shareKeySecret);
      const params = {
        type: testInputs[test].type,
        match: testInputs[test].match,
        fields: testInputs[test].fields,
        index: testInputs[test].index,
        chunkSize: testInputs[test].chunkSize,
        timeout: apiTimeout,
      };

      const processChunk = function(input, output, iterator) {
        return output;
      };

      return api.getFirstOrderChunk(datasetId, params, processChunk, init)
          .should.eventually.deep.equal(testOutputs[test]);
    });

    // Test [9]
    it("should return just the count for zero chunkSize", function() {
      const test = 8;
      const api = new TDXApiStats(config);

      api.setShareKey(shareKeyID, shareKeySecret);
      const params = {
        type: testInputs[test].type,
        match: testInputs[test].match,
        fields: testInputs[test].fields,
        index: testInputs[test].index,
        chunkSize: testInputs[test].chunkSize,
        timeout: apiTimeout,
      };

      return api.getFirstOrderIterator(datasetId, params)
          .then((iterator) => {
            return iterator.next();
          })
          .should.eventually.deep.equal(testOutputs[test]);
    });

    // Test [10]
    it("should return just the count for zero chunkSize", function() {
      const test = 9;
      const api = new TDXApiStats(config);
      const init = {count: 0, Friday: {"$min": Infinity}};

      api.setShareKey(shareKeyID, shareKeySecret);
      const params = {
        type: testInputs[test].type,
        match: testInputs[test].match,
        fields: testInputs[test].fields,
        index: testInputs[test].index,
        chunkSize: testInputs[test].chunkSize,
        timeout: apiTimeout,
      };

      const processChunk = function(input, output, iterator) {
        output.count += input.count;
        output.Friday["$min"] = Math.min(output.Friday["$min"], input.Friday["$min"]);
        return output;
      };

      return api.getFirstOrderChunk(datasetId, params, processChunk, init)
          .should.eventually.deep.equal(testOutputs[test]);
    });

    // Test [11]
    it("should return count=0 for incorrect match", function() {
      const test = 10;
      const api = new TDXApiStats(config);

      api.setShareKey(shareKeyID, shareKeySecret);
      const params = {
        type: testInputs[test].type,
        match: testInputs[test].match,
        fields: testInputs[test].fields,
        index: testInputs[test].index,
        chunkSize: testInputs[test].chunkSize,
        timeout: apiTimeout,
      };

      return api.getFirstOrderIterator(datasetId, params)
          .then((iterator) => {
            return iterator.next();
          })
          .should.eventually.deep.equal(testOutputs[test]);
    });

    // Test [12]
    it("should return just the count for zero chunkSize", function() {
      const test = 11;
      const api = new TDXApiStats(config);
      const init = {count: 0, Friday: {"$min": Infinity}};

      api.setShareKey(shareKeyID, shareKeySecret);
      const params = {
        type: testInputs[test].type,
        match: testInputs[test].match,
        fields: testInputs[test].fields,
        index: testInputs[test].index,
        chunkSize: testInputs[test].chunkSize,
        timeout: apiTimeout,
      };

      const processChunk = function(input, output, iterator) {
        output.count += input.count;
        output.Friday["$min"] = Math.min(output.Friday["$min"], input.Friday["$min"]);
        return output;
      };

      return api.getFirstOrderChunk(datasetId, params, processChunk, init)
          .should.eventually.deep.equal(testOutputs[test]);
    });

    // Test [13]
    it("should return error for incorrect index", function() {
      const test = 12;
      const api = new TDXApiStats(config);
      const init = {count: 0, Friday: {"$avg": 0}};

      api.setShareKey(shareKeyID, shareKeySecret);
      const params = {
        type: testInputs[test].type,
        match: testInputs[test].match,
        fields: testInputs[test].fields,
        index: testInputs[test].index,
        chunkSize: testInputs[test].chunkSize,
        timeout: apiTimeout,
      };

      const processChunk = function(input, output, iterator) {
        const totalCount = parseFloat(iterator.getInternalParam("totalCount"));
        output.count += input.count;
        output.Friday["$avg"] += input.Friday["$avg"] * (parseFloat(input.count) / totalCount);
        return output;
      };

      return api.getFirstOrderChunk(datasetId, params, processChunk, init)
          .should.be.rejected;
    });
  });
});
