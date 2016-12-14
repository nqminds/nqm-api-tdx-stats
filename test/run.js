const log = require("debug")("nqm-api-tdx-stats");
const TDXApiStats = require("../lib/api.js");

const config = {
  "commandHost": "https://cmd.nqminds.com",
  "queryHost": "https://q.nqminds.com",
};

const shareKeyID = "Syl5oSTRme";
const shareKeySecret = "root";

// Educational achievements from Toby's nqminds account'
const datasetId = "VyZFr8hWzg";

const api = new TDXApiStats(config);
api.setShareKey(shareKeyID, shareKeySecret);
api.getFirstOrder(["$min"], datasetId, null, ["rate"])
    .then((val) => {
      log(val.data[0]);
    })
    .catch((err) => {
      log(err);
    });

// const match={"BayType": "Mobility bays"};

// api.getAverage(datasetId, match, ["LotCode"])
//     .then((val) => {
//       log(val.data[0]);
//     })
//     .catch((err) => {
//       log(err);
//     });
