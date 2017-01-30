# First order indexed methods

## getMinIndexed(datasetID, params)
Input arguments:

|Name|Type|Description|
|:---|:---|:---|
|```datasetID```|```String```|ID of the tdx dataset|
|```params```|```Object```|Parameter object|

Parameter object ```params```:

|Name|Type|Description|
|:---|:---|:---|
|```match```|```Object```|[Query match](./params.md#query-match) object|
|```field```|```String```|[query field](./params.md#query-field) string, must be indexed|
|```timeout```|```Integer```|Waiting time period (milliseconds) for nqm-tdx-api function call. If ```timeout = 0``` the waiting time is disregarded|

The function output is a Promise that returns a result object:

|Name|Type|Description|
|:---|:---|:---|
|```params.fields[0]```|```Array```|Array of size one with the minimum value|

## getMaxIndexed(datasetID, params)
Input arguments:

|Name|Type|Description|
|:---|:---|:---|
|```datasetID```|```String```|ID of the tdx dataset|
|```params```|```Object```|Parameter object|

Parameter object ```params```:

|Name|Type|Description|
|:---|:---|:---|
|```match```|```Object```|[Query match](./params.md#query-match) object|
|```field```|```String```|[query field](./params.md#query-field) string, must be indexed|
|```timeout```|```Integer```|Waiting time period (milliseconds) for nqm-tdx-api function call. If ```timeout = 0``` the waiting time is disregarded|

The function output is a Promise that returns a result object:

|Name|Type|Description|
|:---|:---|:---|
|```params.fields[0]```|```Array```|Array of size one with the maximum value|

