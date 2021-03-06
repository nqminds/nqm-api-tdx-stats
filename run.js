// const log = require("debug")("nqm-api-tdx-stats");
const TDXApiStats = require("./lib/api.js");

const config = {
  "commandHost": "https://cmd.nq-m.com",
  "queryHost": "https://q.nq-m.com",
};

const shareKeyID = "ryelV9N3mg";
const shareKeySecret = "root";

// Alexandru Mereacre: Test 1/cost-output
const datasetId = "rklWhQU0Ue";

const testInputs = [
  {
    match: {"$and": [{"SID": "2021"}, {"Waste_Type": "WOODMX"}, {"HWRC": "Winchester"}]},
    field: "Satturday",
    index: [],
    binIndex: {
      type: "number",
      count: 1,
      low: [],
      upp: [],
    },
    chunkSize: 0,
  }, // Test [1]
];

const test = 0;
const api = new TDXApiStats(config);

api.setShareKey(shareKeyID, shareKeySecret);

api.getHistogram(datasetId, testInputs[test])
  .then((result) => {
    console.log(result);
  });
