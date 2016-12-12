module.exports = (function() {
  "use strict";

  const TDXApi = require("nqm-api-tdx");
  const Promise = require("bluebird");
  const _ = require("lodash");

  const setToken = function(token) {
    this.config.accessToken = token || "";

    // Obtain the new tdxApi object after assigning a new token
    this.tdxApi = new TDXApi(this.config);
    Promise.promisifyAll(this.tdxApi);
  };

  const setShareKey = function(keyID, keySecret) {
    this.shareKeyID = keyID || "";
    this.shareKeySecret = keySecret || "";
    this.config.accessToken = "";

    // Obtain the new tdxApi object after clearing the accessToken
    this.tdxApi = new TDXApi(this.config);
    Promise.promisifyAll(this.tdxApi);
  };

  const authenticate = function() {
    if (this.config.accessToken !== "")
      return Promise.resolve();
    else
      return this.tdxApi.authenticateAsync(this.shareKeyID, this.shareKeySecret)
            .then((accessToken) => {
              this.config.accessToken = accessToken;
              return Promise.resolve();
            })
            .catch((err) => {
              return Promise.reject(err);
            });
  };

  function Authentication(config) {
    this.config = _.clone(config);
    this.config.accessToken = this.config.accessToken || "";

    this.tdxApi = new TDXApi(this.config);
    Promise.promisifyAll(this.tdxApi);

    this.setToken = setToken;
    this.setShareKey = setShareKey;
    this.authenticate = authenticate;
  }

  return Authentication;
}());
