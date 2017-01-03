module.exports = (function() {
  "use strict";

  let callFunc = function() {};
  let changeFunc = function() {};
  let funcParams;

  const next = function() {
    const doneState = changeFunc.apply(null, funcParams);
    const val = callFunc.apply(null, funcParams);

    return {done: doneState, value: val};
  };

  function ChunkIterator(callFunction, params, changeFunction) {
    callFunc = callFunction;
    changeFunc = changeFunction;
    funcParams = params;

    this.next = next;
  }

  return ChunkIterator;
}());
