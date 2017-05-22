module.exports = (function() {
  "use strict";

  const Promise = require("bluebird");
  let api;
  let shareKeyID = "";
  let shareKeySecret = "";

  // Returns a Promise with success or reject after authentication
  const authenticate = function() {
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

  // Sets the tdx-api token
  const setToken = function(token) {
    api._accessToken = token || "";
  };

  // Sets the tdx-api shared key
  const setShareKey = function(keyID, keySecret) {
    shareKeyID = keyID || "";
    shareKeySecret = keySecret || "";
    api._accessToken = "";
  };

  function Authentication(tdxApi) {
    api = tdxApi;

    this.setToken = setToken;
    this.setShareKey = setShareKey;
    this.authenticate = authenticate;
  }

  return Authentication;
}());
