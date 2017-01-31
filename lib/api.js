module.exports = (function() {
  "use strict";

  const Promise = require("bluebird");

  const TDXApi = require("nqm-api-tdx");
  const FirstOrderApi = require("./first-order");
  const SecondOrderApi = require("./second-order");
  const FirstOrderChunkApi = require("./first-order-chunk");
  const SecondOrderChunkApi = require("./second-order-chunk");
  const FirstOrderIndexedApi = require("./first-order-indexed");
  const SecondOrderIndexedApi = require("./second-order-indexed");
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

    const soApi = new SecondOrderApi(this.tdxApi, authObj.authenticate);
    this.getHistogram = soApi.getHistogram;
    this.getBasicBins = soApi.getBasicBins;

    const soChunkApi = new SecondOrderChunkApi(this.tdxApi, authObj.authenticate);
    this.getHistogramChunk = soChunkApi.getHistogramChunk;

    const foIndexedApi = new FirstOrderIndexedApi(this.tdxApi);
    this.getMinIndexed = foIndexedApi.getMinIndexed;
    this.getMaxIndexed = foIndexedApi.getMaxIndexed;

    const soIndexedApi = new SecondOrderIndexedApi(this.tdxApi);
    this.getHistogramIndexed = soIndexedApi.getHistogramIndexed;
  }

  return StatsAPI;
}());
