/* eslint-env mocha */
"use strict";

const chai = require("chai");
const ChunkIterator = require("../lib/chunk-iterator.js");
const _ = require("lodash");

chai.should();

describe("chunk-iterator.test.js", function() {
  it("should return done=true", function() {
    const funcParams = ["Test1", {key1: 1, key2: 2}, 43];
    const firstFuncParams = ["Test4", {key1: 2, key2: 3}, 44];
    const secondFuncParams = ["Test4", {key1: 3, key2: 4}, 45];

    const callFunction = function(changeOutput) {
      return Promise.resolve(this._funcParams);
    };

    const changeFunction = function() {
      if (_.isEqual(this._funcParams, firstFuncParams))
        this._done = true;

      this._funcParams[0] = "Test4";
      this._funcParams[1].key1 = this._funcParams[1].key1 + 1;
      this._funcParams[1].key2 = this._funcParams[1].key2 + 1;
      this._funcParams[2] = this._funcParams[2] + 1;

      return Promise.resolve({});
    };

    const iterator = new ChunkIterator(changeFunction, callFunction, funcParams);

    const ret = iterator.next();
    return ret
              .then((val) => {
                return Promise.resolve(val);
              })
              .should.eventually.deep.equal(firstFuncParams)
              .then(() => {
                return iterator.next();
              })
              .then((ret) => {
                return Promise.resolve(ret);
              })
              .should.eventually.deep.equal(secondFuncParams)
              .then(() => {
                return iterator.next();
              })
              .then((ret) => {
                return Promise.resolve(ret);
              })
              .should.eventually.deep.equal(secondFuncParams);
  });
});
