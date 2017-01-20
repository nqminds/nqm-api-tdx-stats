/* eslint-env mocha */
"use strict";

const chai = require("chai");
const chaiAsPromised = require("chai-as-promised");
const Promise = require("bluebird");

chai.use(chaiAsPromised);
chai.should();

const TDXApiStats = require("../lib/api.js");

const config = {
  "commandHost": "https://cmd.nq-m.com",
  "queryHost": "https://q.nq-m.com",
};

const shareKeyID = "ryelV9N3mg";
const shareKeySecret = "root";

// Alexandru Mereacre: Test 1/cost-output
const datasetId = "rklWhQU0Ue";

const testInputs = [
  {type: [{"$min": "$$"}], chunkSize: 0, match: {}, fields: ["Friday"], index: []},                                    // Test [1]
  {type: [{"$max": "$$"}], chunkSize: 10, match: {"$and": [{"SID": "2021"}, {"Waste_Type": "WOODMX"}, {"HWRC": "Winchester"}]}, fields: ["Friday"], index: ["SID", "HWRC", "Waste_Type", "NID", "Contract", "First_Movement"]},
  {type: [{"$max": "$$"}], chunkSize: 20, match: {"$and": [{"SID": "2021"}, {"Waste_Type": "WOODMX"}, {"HWRC": "Winchester"}]}, fields: ["Friday"], index: ["SID", "HWRC", "Waste_Type", "NID", "Contract", "First_Movement"]},
  {type: [{"$max": "$$"}], chunkSize: 20, match: {"$and": [{"SID": "2021"}, {"Waste_Type": "WOODMX"}, {"HWRC": "Winchester"}]}, fields: ["Friday"], index: ["SID", "HWRC", "Waste_Type", "NID", "Contract", "First_Movement"]},
  {type: [{"$avg": "$$"}], chunkSize: 20, match: {"$and": [{"SID": "2021"}, {"Waste_Type": "WOODMX"}, {"HWRC": "Winchester"}]}, fields: ["Friday"], index: ["SID", "HWRC", "Waste_Type", "NID", "Contract", "First_Movement"]},
  {type: [{"$avg": "$$"}], chunkSize: 20, match: {"$and": [{"SID": "2021"}, {"Waste_Type": "WOODMX"}, {"HWRC": "Winchester"}]}, fields: ["Friday"], index: ["SID", "HWRC", "Waste_Type", "NID", "Contract", "First_Movement"]},
  {type: [], chunkSize: 20, match: {"$and": [{"SID": "2021"}, {"Waste_Type": "WOODMX"}, {"HWRC": "Winchester"}]}, fields: ["Friday"], index: ["SID", "HWRC", "Waste_Type", "NID", "Contract", "First_Movement"]},
  {type: [], chunkSize: 20, match: {"$and": [{"SID": "2021"}, {"Waste_Type": "WOODMX"}, {"HWRC": "Winchester"}]}, fields: ["Friday"], index: ["SID", "HWRC", "Waste_Type", "NID", "Contract", "First_Movement"]},
  {type: [{"$min": "$$"}], chunkSize: 0, match: {"$and": [{"SID": "2021"}, {"Waste_Type": "WOODMX"}, {"HWRC": "Winchester"}]}, fields: ["Friday"], index: ["SID", "HWRC", "Waste_Type", "NID", "Contract", "First_Movement"]},
  {type: [{"$min": "$$"}], chunkSize: 0, match: {"$and": [{"SID": "2021"}, {"Waste_Type": "WOODMX"}, {"HWRC": "Winchester"}]}, fields: ["Friday"], index: ["SID", "HWRC", "Waste_Type", "NID", "Contract", "First_Movement"]},
  {type: [{"$min": "$$"}], chunkSize: 20, match: {"$and": [{"SID": "20212"}, {"Waste_Type": "WOODMX"}, {"HWRC": "Winchester"}]}, fields: ["Friday"], index: ["SID", "HWRC", "Waste_Type", "NID", "Contract", "First_Movement"]},
  {type: [{"$min": "$$"}], chunkSize: 20, match: {"$and": [{"SID": "20212"}, {"Waste_Type": "WOODMX"}, {"HWRC": "Winchester"}]}, fields: ["Friday"], index: ["SID", "HWRC", "Waste_Type", "NID", "Contract", "First_Movement"]},
  {type: [{"$min": "$$"}], chunkSize: 20, match: {"$and": [{"SID": "2021"}, {"Waste_Type": "WOODMX"}, {"HWRC": "Winchester"}]}, fields: ["Friday"], index: ["SSID", "HHWRC", "Waste_Type", "NNID", "Contract", "First_Movement"]},
  {type: [], chunkSize: 20, match: {"$and": [{"SID": "2021"}, {"Waste_Type": "WOODMX"}, {"HWRC": "Winchester"}]}, fields: ["Friday", "Cost"], index: ["SID", "HWRC", "Waste_Type", "NID", "Contract", "First_Movement"]},
  {type: [], chunkSize: 20, match: {"$and": [{"SID": "2021"}, {"Waste_Type": "WOODMX"}, {"HWRC": "Winchester"}]}, fields: ["Friday", "Cost"], index: ["SID", "HWRC", "Waste_Type", "NID", "Contract", "First_Movement"]},
  {type: [], chunkSize: 20, match: {"$and": [{"SID": "2021"}, {"Waste_Type": "WOODMX"}, {"HWRC": "Winchester"}]}, fields: ["Friday", "Cost"], index: ["SID", "HWRC", "Waste_Type", "NID", "Contract", "First_Movement"]},
  {type: [], chunkSize: 20, match: {"$and": [{"SID": "2021"}, {"Waste_Type": "WOODMX"}, {"HWRC": "Winchester"}]}, fields: ["Friday", "Cost"], index: ["SID", "HWRC", "Waste_Type", "NID", "Contract", "First_Movement"]},
];

const testOutputs = [
  {                       // Test [1]
    count: 27520,
    Friday: [0],
  },
  {                       // Test [2]
    count: 10,
    Friday: [93.18],
  },
  {                       // Test [3]
    count: 20,
    Friday: [93.16],
  },
  {                       // Test [4]
    done: false,
    iterationNumber: 2,
  },
  {                       // Test [5]
    count: 50,
    Friday: [25.2672],
  },
  {                       // Test [6]
    count: 50,
    Friday: [25.2672],
  },
  {                       // Test [7]
    count: 50,
  },
  {                       // Test [8]
    count: 50,
  },
  {                       // Test [9]
    count: 50,
    Friday: [0.41],
  },
  {                       // Test [10]
    count: 50,
    Friday: [0.41],
  },
  {                       // Test [11]
    count: 0,
  },
  {                       // Test [12]
    count: 0,
  },
  {                       // Test [13]
    count: 50,
    Friday: [25.2672],
  },
  {                       // Test [14]
    count: 50,
    Friday: [0.41],
    Cost: [116.06],
  },
  {                       // Test [15]
    count: 50,
    Friday: [93.18],
    Cost: [18908.97],
  },
  {                       // Test [16]
    count: 50,
    Friday: [1263],
    Cost: [274400],
  },
  {                       // Test [17]
    count: 50,
    Friday: [25],
    Cost: [5488],
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
      const initOutput = {count: 0, Friday: [0]};

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
                    out.Friday[0] += val.Friday[0] * (parseFloat(val.count) / totalCount);
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
      const init = {count: 0, Friday: [0]};

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
        output.Friday[0] += input.Friday[0] * (parseFloat(input.count) / totalCount);
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
      const init = {count: 0, Friday: [Infinity]};

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
        output.Friday[0] = Math.min(output.Friday[0], input.Friday[0]);
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
      const init = {count: 0, Friday: [Infinity]};

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
        output.Friday[0] = Math.min(output.Friday[0], input.Friday[0]);
        return output;
      };

      return api.getFirstOrderChunk(datasetId, params, processChunk, init)
          .should.eventually.deep.equal(testOutputs[test]);
    });

    // Test [13]
    it("should return error for incorrect index", function() {
      const test = 12;
      const api = new TDXApiStats(config);
      const init = {count: 0, Friday: [0]};

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
        output.Friday[0] += input.Friday[0] * (parseFloat(input.count) / totalCount);
        return output;
      };

      return api.getFirstOrderChunk(datasetId, params, processChunk, init)
          .should.be.rejected;
    });

    // Test [14]
    it(`should return the minimum for index ${JSON.stringify(testInputs[13].index)}`, function() {
      const test = 13;
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

      return api.getMinChunk(datasetId, params)
          .should.eventually.deep.equal(testOutputs[test]);
    });

    // Test [15]
    it(`should return the maximum for index ${JSON.stringify(testInputs[14].index)}`, function() {
      const test = 14;
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

      return api.getMaxChunk(datasetId, params)
          .should.eventually.deep.equal(testOutputs[test]);
    });

    // Test [16]
    it(`should return the sum for index ${JSON.stringify(testInputs[15].index)}`, function() {
      const test = 15;
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

      return api.getSumChunk(datasetId, params)
          .then((val) => {
            val.Friday[0] = parseInt(val.Friday[0]);
            val.Cost[0] = parseInt(val.Cost[0]);
            return Promise.resolve(val);
          })
          .should.eventually.deep.equal(testOutputs[test]);
    });

    // Test [17]
    it(`should return the sum for index ${JSON.stringify(testInputs[16].index)}`, function() {
      const test = 16;
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

      return api.getAvgChunk(datasetId, params)
          .then((val) => {
            val.Friday[0] = parseInt(val.Friday[0]);
            val.Cost[0] = parseInt(val.Cost[0]);
            return Promise.resolve(val);
          })
          .should.eventually.deep.equal(testOutputs[test]);
    });
  });
});
