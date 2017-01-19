const log = require("debug")("nqm-api-tdx-stats");
const TDXApiStats = require("../lib/api.js");

const config = {
  "commandHost": "https://cmd.nqminds.com",
  "queryHost": "https://q.nqminds.com",
};

const shareKeyID = "Syl5oSTRme";
const shareKeySecret = "root";

// Leo Valberg: hcc waste/cost-output
const datasetId = "HygxXEFSB";

const testInputs = [
    {type: [], chunkSize: 20, match: {"$and": [{"SID": "2021"}, {"Waste_Type": "WOODMX"}, {"HWRC": "Winchester"}]}, fields: ["Friday", "Cost"], index: ["SID", "HWRC", "Waste_Type", "NID", "Contract", "First_Movement"]},
];

const test = 0;
const api = new TDXApiStats(config);

api.setShareKey(shareKeyID, shareKeySecret);

api.getAvg(datasetId, testInputs[test].match, testInputs[test].fields, 10000)
    .then((val) => {
      console.log(val);
    });
