# First order chunk methods
## getFirstOrderIterator(datasetID, params)
Process the dataset in chunks and outputs each value of the chunk in an [Iterator](./iterator.md#iterator-object) object. The function requires the list of primary indices to iterate over.

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
|```index```|```Array```|Array of primary indices string names|
|```chunkSize```|```Integer```|Number of documents in a chunk|
|```timeout```|```Integer```|Waiting time period (milliseconds) for nqm-tdx-api function call. If ```timeout = 0``` the waiting time is disregarded|

The function output is a Promise that returns an [Iterator](./iterator.md#iterator-object) object.

Example:
```js
const datasetID = "12345";
const params ={
  type: [{"$min": "$$"}, {"$max": "$$"}],
  match: {"BayType": "Electric"},
  fields: ["BayCount", "LotCode"],
  index: ["ID", "NID"],
  chunkSize: 200000,
  timeout: 1000
};

let iter;

api.getFirstOrderIterator(datasetId, params)
  .then((iterator) => {
    iter = iterator;
    return iterator.next();
  })
  .then((result) => {
    // Do something with the chunk result
    // const iterationNumber = iter.getInternalParam("iterationNumber");
    // const totalIterations = iter.getInternalParam("totalIterations");
    return iter.next();
  })
  .then((result) => {
    // result:
    // {
    //    count: 223432,
    //    BayCount: [3, 12],
    //    LotCode: [1, 1234],
    //  }
  });
```

## getFirstOrderChunk(datasetID, params, cf, init)
Iterates over all chunks and for every iteration executes a calling function.

Input arguments:

|Name|Type|Description|
|:---|:---|:---|
|```datasetID```|```String```|ID of the tdx dataset|
|```params```|```Object```|Parameter object|
|```cf```|```Function```|Calling function|
|```init```|```Object```|Initial accumulator|

Parameter object ```params```:

|Name|Type|Description|
|:---|:---|:---|
|```type```|```Array```|Array of [query type](./params.md#query-type) objects|
|```match```|```Object```|[Query match](./params.md#query-match) object|
|```fields```|```Array```|Array of [query field](./params.md#query-field) strings|
|```index```|```Array```|Array of primary indices string names|
|```chunkSize```|```Integer```|Number of documents in a chunk|
|```timeout```|```Integer```|Waiting time period (milliseconds) for nqm-tdx-api function call. If ```timeout = 0``` the waiting time is disregarded|

cf(input, output, iterator) - is the calling function with the arguments:

|Name|Type|Description|
|:---|:---|:---|
|```input```|```Object```|Result of the current chunk iteration|
|```output```|```Object```|Current accumulator value|
|```iterator```|```Object```|[Iterator](./iterator.md#iterator-object) object|

Returns the modified accumulator ```output```.

init - is the initial accumulator value.

The function output is a Promise that returns the result:

|Name|Type|Description|
|:---|:---|:---|
|```count```|```Integer```|Total count of documents for the current chunk, less or equal than ```chunkSize```|
|```params.fields[0]```|```Array```|Array of first-order statistics, one for each query type|
|...|...|...|
|```params.fields[n-1]```|```Array```|Array of first-order statistics, one for each query type|

The final accumulator value is equal to the return of the function ```getFirstOrderChunk```.

Example:
```js
const datasetID = "12345";
const params ={
  type: [{"$min": "$$"}, {"$max": "$$"}],
  match: {"BayType": "Electric"},
  fields: ["BayCount", "LotCode"],
  index: ["ID", "NID"],
  chunkSize: 200000,
  timeout: 1000
};

const init = {
  count: 0,
  BayCount: [Infinity, 0],
  LotCode: [Infinity, 0],
};

const cf = function(input, output, iterator) {
  output["count"] += input.count;
  output["BayCount"][0] += Math.min(input["BayCount"][0], output["BayCount"][0]);
  output["BayCount"][1] += Math.max(input["BayCount"][1], output["BayCount"][1]);
  output["LotCode"][0] += Math.min(input["LotCode"][0], output["LotCode"][0]);
  output["LotCode"][1] += Math.max(input["LotCode"][1], output["LotCode"][1]);
  return output;
};

api.getFirstOrderChunk(datasetId, params, cf, init)
  .then((result) => {
    // result:
    // {
    //    count: 223432,
    //    BayCount: [3, 12],
    //    LotCode: [1, 1234],
    //  }
  });
```

## getMinChunk(datasetId, params, cf)

Input arguments:

|Name|Type|Description|
|:---|:---|:---|
|```datasetID```|```String```|ID of the tdx dataset|
|```params```|```Object```|Parameter object|
|```cf```|```Function```|Calling function|

Parameter object ```params```:

|Name|Type|Description|
|:---|:---|:---|
|```match```|```Object```|[Query match](./params.md#query-match) object|
|```fields```|```Array```|Array of [query field](./params.md#query-field) strings|
|```index```|```Array```|Array of primary indices string names|
|```chunkSize```|```Integer```|Number of documents in a chunk|
|```timeout```|```Integer```|Waiting time period (milliseconds) for nqm-tdx-api function call. If ```timeout = 0``` the waiting time is disregarded|

cf(iterator) - is the calling function with the [Iterator](./iterator.md#iterator-object) object argument. The function is executed before every iteration.

The function returns a Promise with the result:

|Name|Type|Description|
|:---|:---|:---|
|```count```|```Integer```|Total count of documents for the ```params.match```|
|```params.fields[0]```|```Array```|Min value for the field ```params.fields[0]```|
|...|...|...|
|```params.fields[n-1]```|```Array```|Min value for the field ```params.fields[0]```|

## getMaxChunk(datasetId, params, cf)

Input arguments:

|Name|Type|Description|
|:---|:---|:---|
|```datasetID```|```String```|ID of the tdx dataset|
|```params```|```Object```|Parameter object|
|```cf```|```Function```|Calling function|

Parameter object ```params```:

|Name|Type|Description|
|:---|:---|:---|
|```match```|```Object```|[Query match](./params.md#query-match) object|
|```fields```|```Array```|Array of [query field](./params.md#query-field) strings|
|```index```|```Array```|Array of primary indices string names|
|```chunkSize```|```Integer```|Number of documents in a chunk|
|```timeout```|```Integer```|Waiting time period (milliseconds) for nqm-tdx-api function call. If ```timeout = 0``` the waiting time is disregarded|

cf(iterator) - is the calling function with the [Iterator](./iterator.md#iterator-object) object argument. The function is executed before every iteration.

The function returns a Promise with the result:

|Name|Type|Description|
|:---|:---|:---|
|```count```|```Integer```|Total count of documents for the ```params.match```|
|```params.fields[0]```|```Array```|Max value for the field ```params.fields[0]```|
|...|...|...|
|```params.fields[n-1]```|```Array```|Max value for the field ```params.fields[0]```|

## getSumChunk(datasetId, params, cf)

Input arguments:

|Name|Type|Description|
|:---|:---|:---|
|```datasetID```|```String```|ID of the tdx dataset|
|```params```|```Object```|Parameter object|
|```cf```|```Function```|Calling function|

Parameter object ```params```:

|Name|Type|Description|
|:---|:---|:---|
|```match```|```Object```|[Query match](./params.md#query-match) object|
|```fields```|```Array```|Array of [query field](./params.md#query-field) strings|
|```index```|```Array```|Array of primary indices string names|
|```chunkSize```|```Integer```|Number of documents in a chunk|
|```timeout```|```Integer```|Waiting time period (milliseconds) for nqm-tdx-api function call. If ```timeout = 0``` the waiting time is disregarded|

cf(iterator) - is the calling function with the [Iterator](./iterator.md#iterator-object) object argument. The function is executed before every iteration.

The function returns a Promise with the result:

|Name|Type|Description|
|:---|:---|:---|
|```count```|```Integer```|Total count of documents for the ```params.match```|
|```params.fields[0]```|```Array```|Sum value for the field ```params.fields[0]```|
|...|...|...|
|```params.fields[n-1]```|```Array```|Sum value for the field ```params.fields[0]```|

## getAvgChunk(datasetId, params, cf)

Input arguments:

|Name|Type|Description|
|:---|:---|:---|
|```datasetID```|```String```|ID of the tdx dataset|
|```params```|```Object```|Parameter object|
|```cf```|```Function```|Calling function|

Parameter object ```params```:

|Name|Type|Description|
|:---|:---|:---|
|```match```|```Object```|[Query match](./params.md#query-match) object|
|```fields```|```Array```|Array of [query field](./params.md#query-field) strings|
|```index```|```Array```|Array of primary indices string names|
|```chunkSize```|```Integer```|Number of documents in a chunk|
|```timeout```|```Integer```|Waiting time period (milliseconds) for nqm-tdx-api function call. If ```timeout = 0``` the waiting time is disregarded|

cf(iterator) - is the calling function with the [Iterator](./iterator.md#iterator-object) object argument. The function is executed before every iteration.

The function returns a Promise with the result:

|Name|Type|Description|
|:---|:---|:---|
|```count```|```Integer```|Total count of documents for the ```params.match```|
|```params.fields[0]```|```Array```|Average value for the field ```params.fields[0]```|
|...|...|...|
|```params.fields[n-1]```|```Array```|Average value for the field ```params.fields[0]```|

## getStdChunk(datasetId, params, cf)

Input arguments:

|Name|Type|Description|
|:---|:---|:---|
|```datasetID```|```String```|ID of the tdx dataset|
|```params```|```Object```|Parameter object|
|```cf```|```Function```|Calling function|

Parameter object ```params```:

|Name|Type|Description|
|:---|:---|:---|
|```match```|```Object```|[Query match](./params.md#query-match) object|
|```fields```|```Array```|Array of [query field](./params.md#query-field) strings|
|```index```|```Array```|Array of primary indices string names|
|```chunkSize```|```Integer```|Number of documents in a chunk|
|```distribution```|```String```|Distributions type ```{"population", "sample"}```|
|```timeout```|```Integer```|Waiting time period (milliseconds) for nqm-tdx-api function call. If ```timeout = 0``` the waiting time is disregarded|

cf(iterator) - is the calling function with the [Iterator](./iterator.md#iterator-object) object argument. The function is executed before every iteration.

The function returns a Promise with the result:

|Name|Type|Description|
|:---|:---|:---|
|```count```|```Integer```|Total count of documents for the ```params.match```|
|```params.fields[0]```|```Array```|Standard deviation value for the field ```params.fields[0]```|
|...|...|...|
|```params.fields[n-1]```|```Array```|Standard deviation value for the field ```params.fields[0]```|
