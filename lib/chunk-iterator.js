module.exports = (function() {
  "use strict";

  const next = function() {
    if (!this._done) {
      this._value = this._changeFunc.call(this)
        .then((changeOutput) => {
          return this._callFunc.call(this, changeOutput);
        });
    }
    return this._value;
  };

  const getInternalParam = function(key) {
    return this._internalParams[key];
  };

  const setInternalParam = function(key, value) {
    this._internalParams[key] = value;
  };

  const setFuncParam = function(key, value) {
    this._funcParams[key] = value;
  };

  function ChunkIterator(callFunction, params, changeFunction) {
    this._callFunc = callFunction;
    this._changeFunc = changeFunction;

    this._funcParams = params;
    this._value = {};
    this._done = false;
    this._internalParams = {};

    this.next = next;
    this.setFuncParam = setFuncParam;
    this.setInternalParam = setInternalParam;
    this.getInternalParam = getInternalParam;
  }

  return ChunkIterator;
}());
