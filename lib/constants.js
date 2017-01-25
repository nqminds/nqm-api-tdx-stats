exports.countFieldName = "__count__";
exports.countResultFieldName = "count";
exports.aggregateErrorName = "Aggregate error";
exports.timeoutErrorName = "timeout";
exports.indexErrorName = "Primary index";
exports.funcErrorName = "Invalid function";
exports.chunkSize = 1000;
exports.mongoDbExpr =
[
  "$sum", "$avg", "$max", "$min", "$stdDevPop", "$stdDevSamp",
  "$abs", "$add", "$ceil", "$divide", "$exp", "$floor",
  "$ln", "$log", "$log10", "$mod", "$multiply", "$pow",
  "$sqrt", "$subtract", "$trunc",
];
exports.fieldKey = "\\$\\$";
exports.fieldStrKey = "$$";
exports.stdPopulaton = "population";
exports.stdSample = "sample";
exports.binName = "bins";
exports.binTypes = ["number", "string"];
exports.binLenErrorName = "Invalid bin length";
