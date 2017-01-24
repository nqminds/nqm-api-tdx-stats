# Iterator object

Methods:

|Function name|Description|
|:---|:---|
|```next```|Returns the current chunk result|
|```getInternalParam```|Returns the value of a chunk parameter|

next() - Returns a Promise with the current chunk result:

|Name|Type|Description|
|:---|:---|:---|
|```count```|```Integer```|Total count of documents for the current chunk, less or equal than ```chunkSize```|
|```params.fields[0]```|```Array```|Array of first-order statistics, one for each query type|
|...|...|...|
|```params.fields[n-1]```|```Array```|Array of first-order statistics, one for each query type|

getInternalParam(key) - Returns the Iterator object internal parameter value for the ```key```.

|Key name|Description|
|:---|:---|
|```totalCount```|Returns the total number of documents matching ```params.match```|
|```totalIterations```|Returns the total number of iterations|
|```iterationNumber```|Returns the current iteration number|
|```chunkSize```|Returns the chunk size|
