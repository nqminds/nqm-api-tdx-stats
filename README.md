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
|[tdxApi](https://github.com/nqminds/nqm-api-tdx)| The nqm-tdx-api object|

|Methods (authentication)|Description|
|:---|:---|
|[setToken](https://github.com/nqminds/nqm-api-tdx-stats/#settokentoken)|Sets the token for the tdxApi object|
|`setShareKey`|Sets the shared key for the tdxApi object|

|Methods (first-order)|Description|
|:---|:---|
|`getFirstOrder`|Returns the first order statistic|
|`getMin`|Returns the minimum for a set of fields|
|`getMax`|Returns the maximum for a set of fields|
|`getSum`|Returns the sum for a set of fields|
|`getAvg`|Returns the average for a set of fields|
|`getStdPopulation`|Returns the standard deviation (population) for a set of fields|
|`getStdSample`|Returns the standard deviation (sample) for a set of fields|
|`getMed`|Returns the median for a set of fields|

|Methods (first-order chunking)|Description|
|:---|:---|
|`getFirstOrderIterator`|Returns an iterator object in a promise|
|`getFirstOrderChunk`|Returns the first order statistic using the chunking method|
|`getMinChunk`|Returns the minimum for a set of fields using the chunking method|
|`getMaxChunk`|Returns the maximum for a set of fields using the chunking method|
|`getSumChunk`|Returns the sum for a set of fields using the chunking method|
|`getAvgChunk`|Returns the average for a set of fields using the chunking method|
|`getStdChunk`|Returns the standard deviation for a set of fields using the chunking method|

### setToken(token)
Input arguments

|Name|Type|Description|
|:---|:---|:---|
|token|String|Authentication token|

### setShareKey(keyID, keyPass)
Input arguments

|Name|Type|Description|
|:---|:---|:---|
|keyID|String|Shared key ID|
|keyPass|String|Shared key password|


### query type

