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

## query match

## query field
