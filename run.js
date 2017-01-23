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
    {type: [], chunkSize: 20, match: {"$and": [{"SID": "2021"}, {"Waste_Type": "WOODMX"}, {"HWRC": "Winchester"}]}, fields: ["Friday", "Cost"], index: ["SID", "HWRC", "Waste_Type", "NID", "Contract", "First_Movement"]},
];

const test = 0;
const api = new TDXApiStats(config);

api.setShareKey(shareKeyID, shareKeySecret);

api.getStdSample(datasetId, testInputs[test].match, testInputs[test].fields, 10000)
    .then((val) => {
      console.log(val);
    });
