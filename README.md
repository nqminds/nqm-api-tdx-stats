# nqm-api-tdx-stats
nquiringminds statistics API interface for nodejs clients

## Install
```cmd
npm install nqm-api-tdx-stats
```

## Test
```cmd
npm test
```
## Include

### nodejs
```js
const TDXApiStats = require("nqm-api-tdx-stats");
```

### meteor
```js
import TDXApiStats from "nqm-api-tdx-stats/client-api"
```

### web page
Copy client-api.js (generated when you npm install) to your js directory then:
```
<script src="/path/to/client-api.js"></script>
```

## Usage
Include in the appropriate manner as shown above

Passing a shared key:
```js
const config = {
  "commandHost": "https://cmd.nq-m.com",
  "queryHost": "https://q.nq-m.com",
};

const tokenID = "token_id";
const tokenPass = "token_password";
const datasetID = "datasetID";

const api = new TDXApiStats(config);
api.setShareKey(tokenID, tokenPass);

api.getStdSample(datasetID, [], ["field"], 0)
  .then((res) => {
    // res = the result of the computation
  });
```

Passing an existing token:
```js
const config = {
  "commandHost": "https://cmd.nq-m.com",
  "queryHost": "https://q.nq-m.com",
  "accessToken": "access_token",
};

const datasetID = "datasetID";

const api = new TDXApiStats(config);

api.getStdSample(datasetID, [], ["field"], 0)
  .then((res) => {
    // res = the result of the computation
  });
```
## API
|Properties|Description|
|:---|:---|
|`tdxApi`| The nqm-tdx-api object|

|Methods (authentication)|Description|
|:---|:---|
|`setToken(token)`|Sets the token for the tdxApi object|
|`setShareKey(keyId, keyPass)`|Sets the shared key for the tdxApi object|

|Methods (first-order)|Description|
|:---|:---|
|`getFirstOrder(datasetID, params)`|Returns the first order statistic|
|`getMin(datasetId, match, fields, timeout)`|Returns the minimum for a set of fields|
|`getMax(datasetId, match, fields, timeout)`|Returns the maximum for a set of fields|
|`getSum(datasetId, match, fields, timeout)`|Returns the sum for a set of fields|
|`getAvg(datasetId, match, fields, timeout)`|Returns the average for a set of fields|
|`getStdPopulation(datasetId, match, fields, timeout)`|Returns the standard deviation (population) for a set of fields|
|`getStdSample(datasetId, match, fields, timeout)`|Returns the standard deviation (sample) for a set of fields|
|`getMed(datasetId, match, fields, timeout)`|Returns the median for a set of fields|
