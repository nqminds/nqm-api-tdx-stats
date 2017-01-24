# Method parameters
## query type
The query type expression is an object of the type:
```
{ $op: <expression> }
```
The ```$op``` key is a:

1) [Group accumulator operator](https://docs.mongodb.com/manual/reference/operator/aggregation-group) ```["$min", "$max", "$sum", "$avg", "$stdDevPop", "$stdDevSamp"]``` or

2) [Arithmetic aggregation operator](https://docs.mongodb.com/manual/reference/operator/aggregation-arithmetic). 

The ```<expression>``` value is any valid query type expression.

The expression contains the parameter ```$$``` that denotes the dataset field on which the expression is to be applied.

Example:
```js
let field = ["temperature"];

// The min for the field temperature
let type = [{"$min": "$$"}];

// The min of the square root of the temperature
type = [{"$min": {"$pow":["$$", 2]}}]

// The min of the sum between the field temperature and the field bias
type = [{"$min": {"$add":["$$", "$bias"]}}]

```

## query match
The query match is an object of the type:
```
{ $op: <expression> }
```

The ```$op``` key is a [query and projection operator](https://docs.mongodb.com/manual/reference/operator/query/).

The ```<expression>``` value is any valid query match expression.

Examples:

```js

// Match all documents with ID = 24
let match = {"ID": {"$eq": 24}};

// Match all documents with ID > 24
match = {"ID": {"$gt": 24}};

// Match all documents with ID > 24 and Name = "Stat"
match = {"$and": [{"ID": {"$gt": 24}}, {"Name": {"$eq": "Stat"}}]}
```

## query field
The query field is a dataset field name (```String```) on the computation is to be performed.

