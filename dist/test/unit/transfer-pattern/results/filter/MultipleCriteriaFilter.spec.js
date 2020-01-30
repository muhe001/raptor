"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai = require("chai");
const MultipleCriteriaFilter_1 = require("../../../../../src/results/filter/MultipleCriteriaFilter");
const util_1 = require("../../../util");
describe("MultipleCriteriaFilter", () => {
    const filter = new MultipleCriteriaFilter_1.MultipleCriteriaFilter();
    it("removes slower journeys", () => {
        const journeys = [
            util_1.j([
                util_1.st("A", null, 1000),
                util_1.st("B", 1030, 1035),
                util_1.st("C", 1100, null)
            ]),
            util_1.j([
                util_1.st("A", null, 900),
                util_1.st("B", 1030, 1035),
                util_1.st("C", 1100, null)
            ]),
            util_1.j([
                util_1.st("A", null, 1100),
                util_1.st("B", 1130, 1135),
                util_1.st("C", 1200, null)
            ]),
            util_1.j([
                util_1.st("A", null, 1200),
                util_1.st("B", 1230, 1235),
                util_1.st("C", 1300, null)
            ])
        ];
        const expected = [
            util_1.j([
                util_1.st("A", null, 1000),
                util_1.st("B", 1030, 1035),
                util_1.st("C", 1100, null)
            ]),
            util_1.j([
                util_1.st("A", null, 1100),
                util_1.st("B", 1130, 1135),
                util_1.st("C", 1200, null)
            ]),
            util_1.j([
                util_1.st("A", null, 1200),
                util_1.st("B", 1230, 1235),
                util_1.st("C", 1300, null)
            ])
        ];
        const actual = filter.apply(journeys);
        chai.expect(actual).to.deep.equal(expected);
    });
    it("keeps slower journeys if they have fewer changes", () => {
        const journeys = [
            util_1.j([util_1.st("A", null, 1000), util_1.st("B", 1030, 1035)], [util_1.st("C", 1100, null)]),
            util_1.j([
                util_1.st("A", null, 900),
                util_1.st("C", 1100, null)
            ]),
            util_1.j([
                util_1.st("A", null, 1100),
                util_1.st("B", 1130, 1135),
                util_1.st("C", 1200, null)
            ]),
            util_1.j([
                util_1.st("A", null, 1200),
                util_1.st("B", 1230, 1235),
                util_1.st("C", 1300, null)
            ])
        ];
        const expected = [
            util_1.j([
                util_1.st("A", null, 900),
                util_1.st("C", 1100, null)
            ]),
            util_1.j([util_1.st("A", null, 1000), util_1.st("B", 1030, 1035)], [util_1.st("C", 1100, null)]),
            util_1.j([
                util_1.st("A", null, 1100),
                util_1.st("B", 1130, 1135),
                util_1.st("C", 1200, null)
            ]),
            util_1.j([
                util_1.st("A", null, 1200),
                util_1.st("B", 1230, 1235),
                util_1.st("C", 1300, null)
            ])
        ];
        const actual = filter.apply(journeys);
        chai.expect(actual).to.deep.equal(expected);
    });
    it("sorts journeys before filtering them", () => {
        const journeys = [
            util_1.j([
                util_1.st("A", null, 1000),
                util_1.st("B", 1030, 1035),
                util_1.st("C", 1100, null)
            ]),
            util_1.j([
                util_1.st("A", null, 900),
                util_1.st("B", 1030, 1035),
                util_1.st("C", 1100, null)
            ]),
            util_1.j([
                util_1.st("A", null, 1100),
                util_1.st("B", 1130, 1135),
                util_1.st("C", 1200, null)
            ]),
            util_1.j([
                util_1.st("A", null, 1200),
                util_1.st("B", 1230, 1235),
                util_1.st("C", 1300, null)
            ]),
            util_1.j([
                util_1.st("A", null, 1200),
                util_1.st("B", 1230, 1235),
                util_1.st("C", 1330, null)
            ])
        ];
        const expected = [
            util_1.j([
                util_1.st("A", null, 1000),
                util_1.st("B", 1030, 1035),
                util_1.st("C", 1100, null)
            ]),
            util_1.j([
                util_1.st("A", null, 1100),
                util_1.st("B", 1130, 1135),
                util_1.st("C", 1200, null)
            ]),
            util_1.j([
                util_1.st("A", null, 1200),
                util_1.st("B", 1230, 1235),
                util_1.st("C", 1300, null)
            ])
        ];
        const actual = filter.apply(journeys);
        chai.expect(actual).to.deep.equal(expected);
    });
});
