/* eslint-env mocha */
"use strict";

const chai = require("chai");
chai.should();

const helper = require("../lib/helper-func.js");

const testInputs = [
  {match: {"B": "2"}, indexFilter: {"A": {"$gt": "1"}}},                                  // Test [1]
  {match: {"B": "2"}, indexFilter: {}},                                                   // Test [2]
  {match: {}, indexFilter: {"A": {"$gt": "1"}}},                                          // Test [3]
  {bounds: {"A": "1"}},                                                                   // Test [4]
  {bounds: {}},                                                                           // Test [5]
  {bounds: {"A": "1", "B": "2"}},                                                         // Test [6]
];

const testOutputs = [
  {
    match: {"$and": [{"B": "2"}, {"A": {"$gt": "1"}}]},                                           // Test[1]
  },
  {
    match: {"B": "2"},                                                                            // Test[2]
  },
  {
    match: {"A": {"$gt": "1"}},                                                                   // Test[3]
  },
  {
    filter: {"A": {"$gt": "1"}},                                                                  // Test[4]
  },
  {
    filter: {},                                                                                   // Test[5]
  },
  {
    filter: {"$or": [{"A": {"$gt": "1"}}, {"$and": [{"B": {"$gt": "2"}}, {"A": {"$eq": "1"}}]}]}, // Test[6]
  },
];

describe("helper-func.js", function() {
    // Test [1-3]
  it(`should return the added match for index filter: ${JSON.stringify(testInputs[0].indexFilter)}`, function() {
    let test = 0;

    let ret = helper.addMatch(testInputs[test].match, testInputs[test].indexFilter);
    ret.should.deep.equal(testOutputs[test].match);

    test = 1;
    ret = helper.addMatch(testInputs[test].match, testInputs[test].indexFilter);
    ret.should.deep.equal(testOutputs[test].match);

    test = 2;
    ret = helper.addMatch(testInputs[test].match, testInputs[test].indexFilter);
    ret.should.deep.equal(testOutputs[test].match);
  });

  it(`should return the filter bounds for keyd bounds: ${JSON.stringify(testInputs[3].bounds)}`, function() {
    let test = 3;

    let ret = helper.computeBounds(testInputs[test].bounds);
    ret.should.deep.equal(testOutputs[test].filter);

    test = 4;
    ret = helper.computeBounds(testInputs[test].bounds);
    ret.should.deep.equal(testOutputs[test].filter);

    test = 5;
    ret = helper.computeBounds(testInputs[test].bounds);
    ret.should.deep.equal(testOutputs[test].filter);
  });
});
