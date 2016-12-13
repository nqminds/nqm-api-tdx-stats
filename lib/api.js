module.exports = (function() {
  "use strict";

  const FirstOrder = require("./first-order");
  const FirstOrderChunk = require("./first-order-chunk");
  const Authentication = require("./authentication");

  function API(config) {
    FirstOrder.call(this);
    //FirstOrderChunk.call(this);
    Authentication.call(this, config);
  }

  return API;
}());
