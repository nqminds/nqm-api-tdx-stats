/* eslint-env mocha */
"use strict";

const chai = require("chai");
const ChunkIterator = require("../lib/chunk-iterator.js");
const _ = require("lodash");

chai.should();

describe.only("chunk-iterator.test.js", function() {
  it("should return done=true", function() {
    const funcParams = ["Test1", {key1: 1, key2: 2}, 43];
    const firstFuncParams = ["Test4", {key1: 2, key2: 3}, 44];
    const secondFuncParams = ["Test4", {key1: 3, key2: 4}, 45];

    const callFunction = function(params) {
      const argumentList = _.map(arguments, (val, key) => (val));
      return Promise.resolve(argumentList);
    };

    const changeFunction = function(params) {
      let done = false;
      const argumentList = _.map(arguments, (val, key) => (val));

      if (_.isEqual(argumentList, firstFuncParams))
        done = true;
      argumentList[0] = "Test4";
      argumentList[1].key1 = argumentList[1].key1 + 1;
      argumentList[1].key2 = argumentList[1].key2 + 1;
      argumentList[2] = argumentList[2] + 1;

      return Promise.resolve({done: done, arguments: argumentList});
    };

    const iterator = new ChunkIterator(callFunction, funcParams, changeFunction);

    const ret = iterator.next();
    return ret.value
              .then((val) => {
                return Promise.resolve(val);
              })
              .should.eventually.deep.equal(firstFuncParams)
              .then(() => {
                return iterator.next();
              })
              .then((ret) => {
                return Promise.resolve(ret.value);
              })
              .should.eventually.deep.equal(secondFuncParams)
              .then(() => {
                return iterator.next();
              })
              .then((ret) => {
                return Promise.resolve(ret.value);
              })
              .should.eventually.deep.equal(secondFuncParams);

    // ret = iterator.next();
    // ret.value.should.deep.equal(secondFuncParams);
  });
});
