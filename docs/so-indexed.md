# Second order indexed methods

## getHistogramIndexed(datasetID, params)
Input arguments:

|Name|Type|Description|
|:---|:---|:---|
|```datasetID```|```String```|ID of the tdx dataset|
|```params```|```Object```|Parameter object|

Parameter object ```params```:

|Name|Type|Description|
|:---|:---|:---|
|```match```|```Object```|The [Query match](./params.md#query-match) object|
|```field```|```String```|The [query field](./params.md#query-field) string, must be indexed|
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
the ```binIndex.low``` and ```binIndex.upp``` using the ```min``` and ```max``` values for the field ```params.field```.

For ```binIndex.type = "number"``` the histogram will be computed over the intervals:

```
[binIndex.low[0], binIndex.upp[0]),
[binIndex.low[1], binIndex.upp[1]),
...
[binIndex.low[n-1], binIndex.upp[n-1]]
```

The function output is a Promise that returns a result object:

|Name|Type|Description|
|:---|:---|:---|
|```count```|```Integer```|Total count of documents matching ```params.match```|
|```bins```|```Array```|Histogram array|
|```binIndex```|```Object```|The bin indices object|
