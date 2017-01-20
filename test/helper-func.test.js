/* eslint-env mocha */
"use strict";

const chai = require("chai");
const expect = chai.expect;

const helper = require("../lib/helper-func.js");

const testInputs = [
  {match: {"B": "2"}, indexFilter: {"A": {"$gt": "1"}}},                                  // Test [1]
  {match: {"B": "2"}, indexFilter: {}},                                                   // Test [2]
  {match: {}, indexFilter: {"A": {"$gt": "1"}}},                                          // Test [3]
  {bounds: {"A": "1"}},                                                                   // Test [4]
  {bounds: {}},                                                                           // Test [5]
  {bounds: {"A": "1", "B": "2"}},                                                         // Test [6]
  {obj: {}, field: "name"},                                                               // Test [7]
  {obj: {"A": "$$"}, field: ""},                                                          // Test [8]
  {obj: {"A": "$$"}, field: "name"},                                                      // Test [9]
  {obj: {"A": [{B: {D: "$$"}}, {C: "$$"}]}, field: "name"},                               // Test [10]
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
  {obj: {}},                                                                                      // Test[7]
  {obj: {}},                                                                                      // Test[8]
  {obj: {"A": "$name"}},                                                                          // Test[9]
  {obj: {"A": [{B: {D: "$name"}}, {C: "$name"}]}},                                                // Test[10]
];

describe.only("helper-func.js", function() {
    // Test [1-3]
  it(`should return the added match for index filter: ${JSON.stringify(testInputs[0].indexFilter)}`, function() {
    let test = 0;

    let ret = helper.addMatch(testInputs[test].match, testInputs[test].indexFilter);
    expect(ret).to.deep.equal(testOutputs[test].match);

    test = 1;
    ret = helper.addMatch(testInputs[test].match, testInputs[test].indexFilter);
    expect(ret).to.deep.equal(testOutputs[test].match);

    test = 2;
    ret = helper.addMatch(testInputs[test].match, testInputs[test].indexFilter);
    expect(ret).to.deep.equal(testOutputs[test].match);
  });

  // Test [4-6]
  it(`should return the filter bounds for keyd bounds: ${JSON.stringify(testInputs[3].bounds)}`, function() {
    let test = 3;

    let ret = helper.computeBounds(testInputs[test].bounds);
    expect(ret).to.deep.equal(testOutputs[test].filter);

    test = 4;
    ret = helper.computeBounds(testInputs[test].bounds);
    expect(ret).to.deep.equal(testOutputs[test].filter);

    test = 5;
    ret = helper.computeBounds(testInputs[test].bounds);
    expect(ret).to.deep.equal(testOutputs[test].filter);
  });

  // Test [7-10]
  it("should return the replaced object", function() {
    let test = 6;
    let ret = helper.replaceField(testInputs[test].obj, testInputs[test].field);
    expect(ret).to.deep.equal(testOutputs[test].obj);

    test = 7;
    ret = helper.replaceField(testInputs[test].obj, testInputs[test].field);
    expect(ret).to.deep.equal(testOutputs[test].obj);

    test = 8;
    ret = helper.replaceField(testInputs[test].obj, testInputs[test].field);
    expect(ret).to.deep.equal(testOutputs[test].obj);

    test = 9;
    ret = helper.replaceField(testInputs[test].obj, testInputs[test].field);
    expect(ret).to.deep.equal(testOutputs[test].obj);
  });
});
