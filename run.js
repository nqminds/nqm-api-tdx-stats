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
    match: {"SID": "2021", "Contract": "Contract", "Waste_Type": "GREEN AM", "First_Movement": "CHILBOLTON COMPOSTING SITE"},
    fields: ["Saturday"],
  }, // Test [1]
];

const test = 0;
const api = new TDXApiStats(config);

api.setShareKey(shareKeyID, shareKeySecret);

api.getMax(datasetId, testInputs[test].match, testInputs[test].fields, 10000)
  .then((result) => {
    console.log(result);
  });