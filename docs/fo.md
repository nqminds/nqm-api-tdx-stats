# First order methods

## getFirstOrder(datasetID, params)
Input arguments:

|Name|Type|Description|
|:---|:---|:---|
|```datasetID```|```String```|ID of the tdx dataset|
|```params```|```Object```|Parameter object|

Parameter object ```params```:

|Name|Type|Description|
|:---|:---|:---|
|```type```|```Array```|Array of [query type](./params.md#query-type) objects|
|```match```|```Object```|[Query match](./params.md#query-match) object|
|```fields```|```Array```|Array of [query field](./params.md#query-field) strings|
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

## getMin(datasetID, match, fields, timeout)
Input arguments:

|Name|Type|Description|
|:---|:---|:---|
|```datasetID```|```String```|ID of the tdx dataset|
|```match```|```Object```|[Query match](./params.md#query-match) object|
|```fields```|```Array```|Array of [query field](./params.md#query-field) strings|
|```timeout```|```Integer```|Waiting time period (milliseconds) for nqm-tdx-api function call. If ```timeout = 0``` the waiting time is disregarded|

The function output is a Promise that returns a result object:

|Name|Type|Description|
|:---|:---|:---|
|```count```|```Integer```|Total count of documents matching ```params.match```|
|```params.fields[0]```|```Array```|Minimum value for the field ```params.fields[0]```|
|...|...|...|
|```params.fields[n-1]```|```Array```|Minimum value for the field ```params.fields[n-1]```|

## getMax(datasetID, match, fields, timeout)
Input arguments:

|Name|Type|Description|
|:---|:---|:---|
|```datasetID```|```String```|ID of the tdx dataset|
|```match```|```Object```|[Query match](./params.md#query-match) object|
|```fields```|```Array```|Array of [query field](./params.md#query-field) strings|
|```timeout```|```Integer```|Waiting time period (milliseconds) for nqm-tdx-api function call. If ```timeout = 0``` the waiting time is disregarded|

The function output is a Promise that returns a result object:

|Name|Type|Description|
|:---|:---|:---|
|```count```|```Integer```|Total count of documents matching ```params.match```|
|```params.fields[0]```|```Array```|Maximum value for the field ```params.fields[0]```|
|...|...|...|
|```params.fields[n-1]```|```Array```|Maximum value for the field ```params.fields[n-1]```|

## getSum(datasetID, match, fields, timeout)
Input arguments:

|Name|Type|Description|
|:---|:---|:---|
|```datasetID```|```String```|ID of the tdx dataset|
|```match```|```Object```|[Query match](./params.md#query-match) object|
|```fields```|```Array```|Array of [query field](./params.md#query-field) strings|
|```timeout```|```Integer```|Waiting time period (milliseconds) for nqm-tdx-api function call. If ```timeout = 0``` the waiting time is disregarded|

The function output is a Promise that returns a result object:

|Name|Type|Description|
|:---|:---|:---|
|```count```|```Integer```|Total count of documents matching ```params.match```|
|```params.fields[0]```|```Array```|Sum value for the field ```params.fields[0]```|
|...|...|...|
|```params.fields[n-1]```|```Array```|Sum value for the field ```params.fields[n-1]```|

## getAvg(datasetID, match, fields, timeout)
Input arguments:

|Name|Type|Description|
|:---|:---|:---|
|```datasetID```|```String```|ID of the tdx dataset|
|```match```|```Object```|[Query match](./params.md#query-match) object|
|```fields```|```Array```|Array of [query field](./params.md#query-field) strings|
|```timeout```|```Integer```|Waiting time period (milliseconds) for nqm-tdx-api function call. If ```timeout = 0``` the waiting time is disregarded|

The function output is a Promise that returns a result object:

|Name|Type|Description|
|:---|:---|:---|
|```count```|```Integer```|Total count of documents matching ```params.match```|
|```params.fields[0]```|```Array```|Average value for the field ```params.fields[0]```|
|...|...|...|
|```params.fields[n-1]```|```Array```|Average value for the field ```params.fields[n-1]```|

## getStdSample(datasetID, match, fields, timeout)
Input arguments:

|Name|Type|Description|
|:---|:---|:---|
|```datasetID```|```String```|ID of the tdx dataset|
|```match```|```Object```|[Query match](./params.md#query-match) object|
|```fields```|```Array```|Array of [query field](./params.md#query-field) strings|
|```timeout```|```Integer```|Waiting time period (milliseconds) for nqm-tdx-api function call. If ```timeout = 0``` the waiting time is disregarded|

The function output is a Promise that returns a result object:

|Name|Type|Description|
|:---|:---|:---|
|```count```|```Integer```|Total count of documents matching ```params.match```|
|```params.fields[0]```|```Array```|Standard deviation (sample) value for the field ```params.fields[0]```|
|...|...|...|
|```params.fields[n-1]```|```Array```|Standard deviation (sample) value for the field ```params.fields[n-1]```|

## getStdPopulation(datasetID, match, fields, timeout)
Input arguments:

|Name|Type|Description|
|:---|:---|:---|
|```datasetID```|```String```|ID of the tdx dataset|
|```match```|```Object```|[Query match](./params.md#query-match) object|
|```fields```|```Array```|Array of [query field](./params.md#query-field) strings|
|```timeout```|```Integer```|Waiting time period (milliseconds) for nqm-tdx-api function call. If ```timeout = 0``` the waiting time is disregarded|

The function output is a Promise that returns a result object:

|Name|Type|Description|
|:---|:---|:---|
|```count```|```Integer```|Total count of documents matching ```params.match```|
|```params.fields[0]```|```Array```|Standard deviation (population) value for the field ```params.fields[0]```|
|...|...|...|
|```params.fields[n-1]```|```Array```|Standard deviation (population) value for the field ```params.fields[n-1]```|

## getMed(datasetID, match, fields, timeout)
Input arguments:

|Name|Type|Description|
|:---|:---|:---|
|```datasetID```|```String```|ID of the tdx dataset|
|```match```|```Object```|[Query match](./params.md#query-match) object|
|```fields```|```Array```|Array of [query field](./params.md#query-field) strings|
|```timeout```|```Integer```|Waiting time period (milliseconds) for nqm-tdx-api function call. If ```timeout = 0``` the waiting time is disregarded|

The function output is a Promise that returns a result object:

|Name|Type|Description|
|:---|:---|:---|
|```count```|```Integer```|Total count of documents matching ```params.match```|
|```params.fields[0]```|```Array```|Median value for the field ```params.fields[0]```|
|...|...|...|
|```params.fields[n-1]```|```Array```|Median value for the field ```params.fields[n-1]```|
