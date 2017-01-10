module.exports = (function() {
  "use strict";

  const next = function() {
    if (!this.iterDone) {
      const changeObj = this.changeFunc.apply(null, this.funcParams);
      this.iterDone = changeObj.done;
      this.funcParams = changeObj.arguments;

      const val = this.callFunc.apply(null, this.funcParams);
      this.iterVal = val;
    }

    return {done: this.iterDone, value: this.iterVal};
  };

  function ChunkIterator(callFunction, params, changeFunction) {
    this.callFunc = callFunction;
    this.changeFunc = changeFunction;
    this.funcParams = params;
    this.iterVal = {};
    this.iterDone = false;
    this.next = next;
  }

  return ChunkIterator;
}());
