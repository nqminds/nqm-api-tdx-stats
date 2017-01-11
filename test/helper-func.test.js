/* eslint-env mocha */
"use strict";

const chai = require("chai");
chai.should();

const helper = require("../lib/helper-func.js");

const testInputs = [
  {match: {"A": "1", "B": "2", "C": "3"}, index: ["B"]},                                 // Test [1]
  {match: {"A": "1", "B": "2", "C": "3"}, index: []},                                    // Test [2]
  {match: {"A": "1", "B": "2", "C": "3"}, index: ["A", "B", "C"]},                       // Test [3]
  {bounds: {"A": "1"}},                                                                  // Test [4]
  {bounds: {}},                                                                          // Test [5]
];

const testOutputs = [
  {
    match: {"A": "1", "C": "3"},                // Test[1]
  },
  {
    match: {"A": "1", "B": "2", "C": "3"},      // Test[2]
  },
  {
    match: {},                                  // Test[3]
  },
  {
    filter: {"A": {"$gt": "1"}},                // Test[4]
  },
  {
    filter: {},                                 // Test[5]
  },
];

describe.only("helper-func.js", function() {
    // Test [1-3]
  it(`should return the filtered match for index: ${JSON.stringify(testInputs[0].index)}`, function() {
    let test = 0;

    let ret = helper.filterMatch(testInputs[test].match, testInputs[test].index);
    ret.should.deep.equal(testOutputs[test].match);

    test = 1;
    ret = helper.filterMatch(testInputs[test].match, testInputs[test].index);
    ret.should.deep.equal(testOutputs[test].match);

    test = 2;
    ret = helper.filterMatch(testInputs[test].match, testInputs[test].index);
    ret.should.deep.equal(testOutputs[test].match);
  });

  it(`should return the filter bounds for keyd bounds: ${JSON.stringify(testInputs[3].bounds)}`, function() {
    let test = 3;

    let ret = helper.computeBounds(testInputs[test].bounds);
    ret.should.deep.equal(testOutputs[test].filter);

    test = 4;
    ret = helper.computeBounds(testInputs[test].bounds);
    ret.should.deep.equal(testOutputs[test].filter);
  });
});
