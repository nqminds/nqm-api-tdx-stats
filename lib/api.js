module.exports = (function() {
  "use strict";

  const FirstOrder = require("./first-order");
  const Authentication = require("./authentication");

  function API(config) {
    FirstOrder.call(this);
    Authentication.call(this, config);
  }

  return API;
}());
