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
    this.getMin = foApi.getMin;
    this.getMax = foApi.getMax;
    this.getSum = foApi.getSum;
    this.getAvg = foApi.getAvg;
    this.getStdSample = foApi.getStdSample;
    this.getStdPopulation = foApi.getStdPopulation;
    this.getMed = foApi.getMed;

    const foChunkApi = new FirstOrderChunkApi(this.tdxApi, authObj.authenticate);
    this.getFirstOrderIterator = foChunkApi.getFirstOrderIterator;
    this.getFirstOrderChunk = foChunkApi.getFirstOrderChunk;
    this.getMinChunk = foChunkApi.getMinChunk;
    this.getMaxChunk = foChunkApi.getMaxChunk;
    this.getSumChunk = foChunkApi.getSumChunk;
    this.getAvgChunk = foChunkApi.getAvgChunk;
    this.getStdChunk = foChunkApi.getStdChunk;
    this.getMedChunk = foChunkApi.getMedChunk;
  }

  return StatsAPI;
}());
