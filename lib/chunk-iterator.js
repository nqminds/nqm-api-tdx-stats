module.exports = (function() {
  "use strict";

  let callFunc = function() {};
  let changeFunc = function() {};
  let funcParams;

  const next = function() {
    const changeObj = changeFunc.apply(null, funcParams);
    const val = callFunc.apply(null, changeObj.arguments);

    return {done: changeObj.done, value: val};
  };

  function ChunkIterator(callFunction, params, changeFunction) {
    callFunc = callFunction;
    changeFunc = changeFunction;
    funcParams = params;

    this.next = next;
  }

  return ChunkIterator;
}());
