module.exports = (function() {
    "use strict";

    function API(config) {
        this.config = config;
        this.accessToken = config.accessToken || "";
        this.authenticate = authenticate;
    }

    return API;
}())