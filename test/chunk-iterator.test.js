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

    const callFunction = function(params) {
      const argumentList = _.map(arguments, (val, key) => (val));
      return argumentList;
    };

    const changeFunction = function(params) {
      const argumentList = _.map(arguments, (val, key) => (val));

      argumentList[0] = "Test4";
      argumentList[1].key1 = argumentList[1].key1 + 1;
      argumentList[1].key2 = argumentList[1].key2 + 1;
      argumentList[2] = argumentList[2] + 1;

      return {done: true, arguments: argumentList};
    };

    const iterator = new ChunkIterator(callFunction, funcParams, changeFunction);

    let ret = iterator.next();
    ret.done.should.equal(true);
    ret.value.should.deep.equal(firstFuncParams);

    ret = iterator.next();
    ret.done.should.equal(true);
    ret.value.should.deep.equal(secondFuncParams);
  });
});
