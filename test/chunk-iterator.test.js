/* eslint-env mocha */
"use strict";

const chai = require("chai");
const ChunkIterator = require("../lib/chunk-iterator.js");
const _ = require("lodash");

chai.should();

describe("chunk-iterator.test.js", function() {
  it("should return done=true", function() {
    const funcParams = ["Test1", {key1: 1, key2: 2}, 43];
    const newFuncParams = ["Test4", {key1: 2, key2: 1}, 0];

    const callFunction = function(params) {
      const argumentList = _.map(arguments, (val, key) => (val));
      return argumentList;
    };

    const changeFunction = function(params) {
      const argumentList = _.map(arguments, (val, key) => (val));
      argumentList[0] = "Test4";
      argumentList[1].key1 = 2;
      argumentList[1].key2 = 1;
      argumentList[2] = 0;
      return {done: true, arguments: argumentList};
    };

    const iterator = new ChunkIterator(callFunction, funcParams, changeFunction);

    const ret = iterator.next();
    ret.done.should.equal(true);
    ret.value.should.deep.equal(newFuncParams);
  });
});
