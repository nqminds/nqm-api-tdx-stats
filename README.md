# nqm-api-tdx-stats [![NPM version](https://badge.fury.io/js/nqm-api-tdx-stats.svg)](https://badge.fury.io/js/nqm-api-tdx-stats.svg)
nquiringminds statistics API interface for nodejs clients (requires mongoDB >= 3.2)

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
  .then((result) => {
    // result = the result of the computation
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
  .then((result) => {
    // result = the result of the computation
  });
```

## Properties and Methods
|Properties|Description|
|:---|:---|
|[```tdxApi```](https://github.com/nqminds/nqm-api-tdx)| The nqm-tdx-api object|

|Methods (authentication)|Description|
|:---|:---|
|[```setToken```](./docs/authentication.md#settokentoken)|Sets the token for the tdxApi object|
|[```setShareKey```](./docs/authentication.md#setsharekeykeyid-keypass)|Sets the shared key for the tdxApi object|

|Methods (first-order)|Description|
|:---|:---|
|[```getFirstOrder```](./docs/fo.md#getfirstorderdatasetid-params)|Returns the first order statistic|
|[```getMin```](./docs/fo.md#getmindatasetid-match-fields-timeout)|Returns the minimum for a set of fields|
|[```getMax```](./docs/fo.md#getmaxdatasetid-match-fields-timeout)|Returns the maximum for a set of fields|
|[```getSum```](./docs/fo.md#getsumdatasetid-match-fields-timeout)|Returns the sum for a set of fields|
|[```getAvg```](./docs/fo.md#getavgdatasetid-match-fields-timeout)|Returns the average for a set of fields|
|[```getStdPopulation```](./docs/fo.md#getstdpopulationdatasetid-match-fields-timeout)|Returns the standard deviation (population) for a set of fields|
|[```getStdSample```](./docs/fo.md#getstdsampledatasetid-match-fields-timeout)|Returns the standard deviation (sample) for a set of fields|
|[```getMed```](./docs/fo.md#getmeddatasetid-match-fields-timeout)|Returns the median for a set of fields|

|Methods (first-order chunking)|Description|
|:---|:---|
|[```getFirstOrderIterator```](./docs/fo-chunk.md#getfirstorderiteratordatasetid-params)|Returns an iterator object|
|[```getFirstOrderChunk```](./docs/fo-chunk.md#getfirstorderchunkdatasetid-params-cf-init)|Returns the first order statistic using the chunking method|
|[```getMinChunk```](./docs/fo-chunk.md#getminchunkdatasetid-params-cf)|Returns the minimum for a set of fields using the chunking method|
|[```getMaxChunk```](./docs/fo-chunk.md#getmaxchunkdatasetid-params-cf)|Returns the maximum for a set of fields using the chunking method|
|[```getSumChunk```](./docs/fo-chunk.md#getsumchunkdatasetid-params-cf)|Returns the sum for a set of fields using the chunking method|
|[```getAvgChunk```](./docs/fo-chunk.md#getavgchunkdatasetid-params-cf)|Returns the average for a set of fields using the chunking method|
|[```getStdChunk```](./docs/fo-chunk.md#getstdchunkdatasetid-params-cf)|Returns the standard deviation for a set of fields using the chunking method|

|Methods (second-order)|Description|
|:---|:---|
|[```getHistogram```](./docs/so.md#gethistogramdatasetid-params)|Returns the histogram for a field|

|Methods (second-order chunking)|Description|
|:---|:---|
|[```getHistogramChunk```](./docs/so-chunk.md#gethistogramdatasetid-params)|Returns the histogram for a field using the chunking method|

|Methods (first-order indexed)|Description|
|:---|:---|
|[```getMinIndexed```](./docs/fo-indexed.md#getminindexeddatasetid-params)|Returns the minimum for an indexed field|
|[```getMaxIndexed```](./docs/fo-indexed.md#getmaxindexeddatasetid-params)|Returns the maximum for an indexed field|

|Methods (second-order indexed)|Description|
|:---|:---|
|[```getHistogramIndexed```](./docs/so-indexed.md#gethistogramindexeddatasetid-params)|Returns the histogram for an indexed field|
