module.exports = (function() {
  "use strict";
  
  const FirstOrder = require("./first-order");
  const TDXApi = require("nqm-api-tdx");

  function API(config) {
    const Promise = require("bluebird");

    this.accessToken = config.accessToken || "";
    this.shareKeyID = config.shareKeyID || "";
    this.shareKeySecret = config.shareKeySecret || "";

    this.tdxApi = new TDXApi(config);

    Promise.promisifyAll(this.tdxApi);

    FirstOrder.call(this);
  }

  return API;
}());
