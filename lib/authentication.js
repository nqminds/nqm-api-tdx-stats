module.exports = (function() {
  "use strict";

  const Promise = require("bluebird");
  const _ = require("lodash");
  let api;
  let shareKeyID = "";
  let shareKeySecret = "";

  function authenticate() {
    if (api._accessToken !== "")
      return Promise.resolve();
    else
      return api.authenticateAsync(shareKeyID, shareKeySecret)
            .then((accessToken) => {
              return Promise.resolve();
            })
            .catch((err) => {
              return Promise.reject(err);
            });
  }

  const setToken = function(token) {
    api._accessToken = token || "";
  };

  const setShareKey = function(keyID, keySecret) {
    shareKeyID = keyID || "";
    shareKeySecret = keySecret || "";
    api._accessToken = "";
  };

  const auth = function(cb) {
    return authenticate().then(() => (cb()));
  };

  function Authentication(tdxApi) {
    api = tdxApi;
    this.setToken = setToken;
    this.setShareKey = setShareKey;
    this.auth = auth;
  }

  return Authentication;
}());
