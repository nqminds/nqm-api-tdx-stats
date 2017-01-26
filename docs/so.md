# Second order methods

## getHistogram(datasetID, params)
Input arguments:

|Name|Type|Description|
|:---|:---|:---|
|```datasetID```|```String```|ID of the tdx dataset|
|```params```|```Object```|Parameter object|

Parameter object ```params```:

|Name|Type|Description|
|:---|:---|:---|
|```match```|```Object```|The [Query match](./params.md#query-match) object|
|```field```|```String```|The [query field](./params.md#query-field) string|
|```binIndex```|```Object```|The bin indices object|
|```timeout```|```Integer```|Waiting time period (milliseconds) for nqm-tdx-api function call. If ```timeout = 0``` the waiting time is disregarded|

The bin indices object:

|Name|Type|Description|
|:---|:---|:---|
|```type```|```String```|The type ```{"number", "string"}``` of the ```params.field```|
|```count```|```Integer```|Total number of bins|
|```low```|```Array```|Array with the left bounds of the bin indices. Have the type ```number```|
|```upp```|```Array```|Array with the right bounds of the bin indices. Have the type ```number```|

If ```binIndex.count = n``` and ```binIndex.low.length = 0``` the ```getHistogram``` function will compute
the ```binIndex.low``` and ```binIndex.upp``` using the ```min``` and ```max``` values for the field ```params.field.

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
