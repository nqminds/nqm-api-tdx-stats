const log = require("debug")("nqm-api-tdx-stats");
const TDXApiStats = require("../lib/api.js");

const config = {
  "commandHost": "https://cmd.nq-m.com",
  "queryHost": "https://q.nq-m.com",
};

const shareKeyID = "ryelV9N3mg";
const shareKeySecret = "root";
const datasetId = "SJxzMvRIye"; //"Sygy_xBhml";

const api = new TDXApiStats(config);
api.setShareKey(shareKeyID, shareKeySecret);
api.getMin(datasetId, null, ["persons"])
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
