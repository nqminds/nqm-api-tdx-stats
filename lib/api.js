module.exports = (function() {
  "use strict";

  const Promise = require("bluebird");

  const TDXApi = require("nqm-api-tdx");
  const FirstOrderApi = require("./first-order");
  const FirstOrderChunkApi = require("./first-order-chunk");
  const Authentication = require("./authentication");

  function StatsAPI(config) {
    this.tdxApi = new TDXApi(config);
    Promise.promisifyAll(this.tdxApi);

    const authObj = new Authentication(this.tdxApi);
    this.setToken = authObj.setToken;
    this.setShareKey = authObj.setShareKey;

    const foApi = new FirstOrderApi(this.tdxApi, authObj.authenticate);
    this.getFirstOrder = foApi.getFirstOrder;
    this.getBasic = foApi.getBasic;

    const foChunkApi = new FirstOrderChunkApi(this.tdxApi, authObj.authenticate);
    this.getFirstOrderChunk = foChunkApi.getFirstOrderChunk;
  }

  return StatsAPI;
}());
