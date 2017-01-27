module.exports = (function() {
  "use strict";

  // Function to proceed to the next chunk
  // Returns a promise with the computed value this._value
  const next = function() {
    if (!this._done) {

      // Change the arguments
      this._value = this._changeFunc.call(this)
        .then((changeOutput) => {
          // Execute the calling function
          return this._callFunc.call(this, changeOutput);
        });
    }
    return this._value;
  };

  // Function to retrieve the internal parameters
  const getInternalParam = function(key) {
    return this._internalParams[key];
  };

  // Function to set the internal parameters
  const setInternalParam = function(key, value) {
    this._internalParams[key] = value;
  };

  // Sets the parameters for the functions used inside the _callFunc
  const setFuncParam = function(key, value) {
    this._funcParams[key] = value;
  };

  function ChunkIterator(changeFunction, callFunction, funcParams, groupFunc) {
    this._changeFunc = changeFunction;
    this._callFunc = callFunction;

    // The group function that will be executed in callFunction
    this._groupFunc = groupFunc || function() {};
    // The group function parameters
    this._funcParams = funcParams || {};

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
