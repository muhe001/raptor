"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai = require("chai");
const TimeParser_1 = require("../../../src/gtfs/TimeParser");
describe("TimeParser", () => {
    it("turns a time string into seconds from midnight", () => {
        const parser = new TimeParser_1.TimeParser();
        chai.expect(0).to.equal(parser.getTime("00:00:00"));
        chai.expect(10).to.equal(parser.getTime("00:00:10"));
        chai.expect(130).to.equal(parser.getTime("00:02:10"));
        chai.expect(10930).to.equal(parser.getTime("03:02:10"));
    });
});
