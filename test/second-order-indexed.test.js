/* eslint-env mocha */
"use strict";

const chai = require("chai");
const chaiAsPromised = require("chai-as-promised");

chai.use(chaiAsPromised);
chai.should();

const TDXApiStats = require("../lib/api.js");

const config = {
  "commandHost": "https://cmd.nq-m.com",
  "queryHost": "https://q.nq-m.com",
};

const shareKeyID = "ryelV9N3mg";
const shareKeySecret = "root";

// Alexandru Mereacre: Test 1/cost-output
const datasetId = "rklWhQU0Ue";

const testInputs = [
  {
    match: {"SID": "2021", "Contract": "Contract", "Waste_Type": "GREEN AM", "First_Movement": "CHILBOLTON COMPOSTING SITE"},
    field: "Saturday",
  }, // Test [1]
];

const testOutputs = [
  {
    count: 200,
    Saturday: [0],
  }, // Test [1]
];