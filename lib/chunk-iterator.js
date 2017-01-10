module.exports = (function() {
  "use strict";

  const next = function() {
    if (!this._done) {
      const changeObj = this._changeFunc.apply(null, this._funcParams);
      this._done = changeObj.done;
      this._funcParams = changeObj.arguments;
      this._value = this._callFunc.apply(null, this._funcParams);
    }

    return {done: this._done, count: this._count, value: this._value};
  };

  const setCount = function(count) {
    this._count = count;
  };

  function ChunkIterator(callFunction, params, changeFunction) {
    this._callFunc = callFunction;
    this._changeFunc = changeFunction;
    this._funcParams = params;
    this._value = {};
    this._done = false;
    this._count = 0;
    this.next = next;
    this.setCount = setCount;
  }

  return ChunkIterator;
}());
