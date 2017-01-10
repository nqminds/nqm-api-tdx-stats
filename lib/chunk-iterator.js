module.exports = (function() {
  "use strict";

  const next = function() {
    if (!this.done) {
      const changeObj = this._changeFunc.apply(null, this._funcParams);
      this.done = changeObj.done;
      this._funcParams = changeObj.arguments;

      const val = this._callFunc.apply(null, this._funcParams);
      this.value = val;
    }

    return {done: this.done, value: this.value};
  };

  const setCount = function(count) {
    this.count = count;
  };

  function ChunkIterator(callFunction, params, changeFunction) {
    this._callFunc = callFunction;
    this._changeFunc = changeFunction;
    this._funcParams = params;
    this.value = {};
    this.done = false;
    this.count = 0;
    this.next = next;
    this.setCount = setCount;
  }

  return ChunkIterator;
}());
