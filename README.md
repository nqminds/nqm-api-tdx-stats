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
## Properties and Methods
|Properties|Description|
|:---|:---|
|[```tdxApi```](https://github.com/nqminds/nqm-api-tdx)| The nqm-tdx-api object|

|Methods (authentication)|Description|
|:---|:---|
|[```setToken```](./README.md#settokentoken)|Sets the token for the tdxApi object|
|[```setShareKey```](./README.md#setsharekeykeyid-keypass)|Sets the shared key for the tdxApi object|

|Methods (first-order)|Description|
|:---|:---|
|[```getFirstOrder```](./README.md#getfirstorderdatasetid-params)|Returns the first order statistic|
|[```getMin```](./README.md#getmindatasetid-match-fields-timeout)|Returns the minimum for a set of fields|
|[```getMax```](./README.md#getmaxdatasetid-match-fields-timeout)|Returns the maximum for a set of fields|
|[```getSum```](./README.md#getsumdatasetid-match-fields-timeout)|Returns the sum for a set of fields|
|[```getAvg```](./README.md#getavgdatasetid-match-fields-timeout)|Returns the average for a set of fields|
|[```getStdPopulation```](./README.md#getstdpopulationdatasetid-match-fields-timeout)|Returns the standard deviation (population) for a set of fields|
|[```getStdSample```](./README.md#getstdsampledatasetid-match-fields-timeout)|Returns the standard deviation (sample) for a set of fields|
|[```getMed```](./README.md#getmeddatasetid-match-fields-timeout)|Returns the median for a set of fields|

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
Input arguments:

|Name|Type|Description|
|:---|:---|:---|
|```token```|```String```|Authentication token|

### setShareKey(keyID, keyPass)
Input arguments:

|Name|Type|Description|
|:---|:---|:---|
|```keyID```|```String```|Shared key ID|
|```keyPass```|```String```|Shared key password|

### getFirstOrder(datasetID, params)
Input arguments:

|Name|Type|Description|
|:---|:---|:---|
|```datasetID```|```String```|ID of the tdx dataset|
|```params```|```Object```|Parameter object|

Parameter object ```params```:

|Name|Type|Description|
|:---|:---|:---|
|```type```|```Array```|Array of [query type](./README.md#querytype) objects|
|```match```|```Object```|[Query match](./README.md#querymatch) object|
|```fields```|```Array```|Array of [query field](./README.md#queryfield) strings|
|```timeout```|```Integer```|Waiting time period (milliseconds) for nqm-tdx-api function call. If ```timeout = 0``` the waiting time is disregarded|

The function output is a Promise that returns a result object:

|Name|Type|Description|
|:---|:---|:---|
|```count```|```Integer```|Total count of documents matching ```params.match```|
|```params.fields[0]```|```Array```|Array of first-order statistics, one for each query type|
|...|...|...|
|```params.fields[n-1]```|```Array```|Array of first-order statistics, one for each query type|

Example:
```js
const datasetID = "12345";
const params ={
  type: [{"$min": "$$"}, {"$max": "$$"}],
  match: {"BayType": "Electric"},
  fields: ["BayCount", "LotCode"],
  timeout: 1000,
};

api.getFirstOrder(datasetId, params)
  .then((result) => {
    // result:
    // {
    //    count: 223432,
    //    BayCount: [3, 12],
    //    LotCode: [1, 1234],
    //  }
  });
```
### getMin(datasetId, match, fields, timeout)
Input arguments:

|Name|Type|Description|
|:---|:---|:---|
|```datasetID```|```String```|ID of the tdx dataset|
|```match```|```Object```|[Query match](./README.md#querymatch) object|
|```fields```|```Array```|Array of [query field](./README.md#queryfield) strings|
|```timeout```|```Integer```|Waiting time period (milliseconds) for nqm-tdx-api function call. If ```timeout = 0``` the waiting time is disregarded|

The function output is a Promise that returns a result object:

|Name|Type|Description|
|:---|:---|:---|
|```count```|```Integer```|Total count of documents matching ```params.match```|
|```params.fields[0]```|```Array```|Minimum value for the field ```params.fields[0]```|
|...|...|...|
|```params.fields[n-1]```|```Array```|Minimum value for the field ```params.fields[n-1]```|

### getMax(datasetId, match, fields, timeout)
Input arguments:

|Name|Type|Description|
|:---|:---|:---|
|```datasetID```|```String```|ID of the tdx dataset|
|```match```|```Object```|[Query match](./README.md#querymatch) object|
|```fields```|```Array```|Array of [query field](./README.md#queryfield) strings|
|```timeout```|```Integer```|Waiting time period (milliseconds) for nqm-tdx-api function call. If ```timeout = 0``` the waiting time is disregarded|

The function output is a Promise that returns a result object:

|Name|Type|Description|
|:---|:---|:---|
|```count```|```Integer```|Total count of documents matching ```params.match```|
|```params.fields[0]```|```Array```|Maximum value for the field ```params.fields[0]```|
|...|...|...|
|```params.fields[n-1]```|```Array```|Maximum value for the field ```params.fields[n-1]```|

### getSum(datasetId, match, fields, timeout)
Input arguments:

|Name|Type|Description|
|:---|:---|:---|
|```datasetID```|```String```|ID of the tdx dataset|
|```match```|```Object```|[Query match](./README.md#querymatch) object|
|```fields```|```Array```|Array of [query field](./README.md#queryfield) strings|
|```timeout```|```Integer```|Waiting time period (milliseconds) for nqm-tdx-api function call. If ```timeout = 0``` the waiting time is disregarded|

The function output is a Promise that returns a result object:

|Name|Type|Description|
|:---|:---|:---|
|```count```|```Integer```|Total count of documents matching ```params.match```|
|```params.fields[0]```|```Array```|Sum value for the field ```params.fields[0]```|
|...|...|...|
|```params.fields[n-1]```|```Array```|Sum value for the field ```params.fields[n-1]```|

### getAvg(datasetId, match, fields, timeout)
Input arguments:

|Name|Type|Description|
|:---|:---|:---|
|```datasetID```|```String```|ID of the tdx dataset|
|```match```|```Object```|[Query match](./README.md#querymatch) object|
|```fields```|```Array```|Array of [query field](./README.md#queryfield) strings|
|```timeout```|```Integer```|Waiting time period (milliseconds) for nqm-tdx-api function call. If ```timeout = 0``` the waiting time is disregarded|

The function output is a Promise that returns a result object:

|Name|Type|Description|
|:---|:---|:---|
|```count```|```Integer```|Total count of documents matching ```params.match```|
|```params.fields[0]```|```Array```|Average value for the field ```params.fields[0]```|
|...|...|...|
|```params.fields[n-1]```|```Array```|Average value for the field ```params.fields[n-1]```|

### getStdSample(datasetId, match, fields, timeout)
Input arguments:

|Name|Type|Description|
|:---|:---|:---|
|```datasetID```|```String```|ID of the tdx dataset|
|```match```|```Object```|[Query match](./README.md#querymatch) object|
|```fields```|```Array```|Array of [query field](./README.md#queryfield) strings|
|```timeout```|```Integer```|Waiting time period (milliseconds) for nqm-tdx-api function call. If ```timeout = 0``` the waiting time is disregarded|

The function output is a Promise that returns a result object:

|Name|Type|Description|
|:---|:---|:---|
|```count```|```Integer```|Total count of documents matching ```params.match```|
|```params.fields[0]```|```Array```|Standard deviation (sample) value for the field ```params.fields[0]```|
|...|...|...|
|```params.fields[n-1]```|```Array```|Standard deviation (sample) value for the field ```params.fields[n-1]```|

### getStdPopulation(datasetId, match, fields, timeout)
Input arguments:

|Name|Type|Description|
|:---|:---|:---|
|```datasetID```|```String```|ID of the tdx dataset|
|```match```|```Object```|[Query match](./README.md#querymatch) object|
|```fields```|```Array```|Array of [query field](./README.md#queryfield) strings|
|```timeout```|```Integer```|Waiting time period (milliseconds) for nqm-tdx-api function call. If ```timeout = 0``` the waiting time is disregarded|

The function output is a Promise that returns a result object:

|Name|Type|Description|
|:---|:---|:---|
|```count```|```Integer```|Total count of documents matching ```params.match```|
|```params.fields[0]```|```Array```|Standard deviation (population) value for the field ```params.fields[0]```|
|...|...|...|
|```params.fields[n-1]```|```Array```|Standard deviation (population) value for the field ```params.fields[n-1]```|

### getMed(datasetId, match, fields, timeout)
Input arguments:

|Name|Type|Description|
|:---|:---|:---|
|```datasetID```|```String```|ID of the tdx dataset|
|```match```|```Object```|[Query match](./README.md#querymatch) object|
|```fields```|```Array```|Array of [query field](./README.md#queryfield) strings|
|```timeout```|```Integer```|Waiting time period (milliseconds) for nqm-tdx-api function call. If ```timeout = 0``` the waiting time is disregarded|

The function output is a Promise that returns a result object:

|Name|Type|Description|
|:---|:---|:---|
|```count```|```Integer```|Total count of documents matching ```params.match```|
|```params.fields[0]```|```Array```|Median value for the field ```params.fields[0]```|
|...|...|...|
|```params.fields[n-1]```|```Array```|Median value for the field ```params.fields[n-1]```|

### query type

### query match

### query field

