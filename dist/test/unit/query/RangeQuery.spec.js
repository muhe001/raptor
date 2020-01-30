"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const util_1 = require("../util");
const chai = require("chai");
const JourneyFactory_1 = require("../../../src/results/JourneyFactory");
const RaptorAlgorithmFactory_1 = require("../../../src/raptor/RaptorAlgorithmFactory");
const RangeQuery_1 = require("../../../src/query/RangeQuery");
describe("RangeQuery", () => {
    const journeyFactory = new JourneyFactory_1.JourneyFactory();
    it("performs profile queries", () => {
        const trips = [
            util_1.t(util_1.st("A", null, 1000), util_1.st("B", 1030, 1035), util_1.st("C", 1100, null)),
            util_1.t(util_1.st("A", null, 1100), util_1.st("B", 1130, 1135), util_1.st("C", 1200, null)),
            util_1.t(util_1.st("A", null, 1200), util_1.st("B", 1230, 1235), util_1.st("C", 1300, null))
        ];
        const raptor = RaptorAlgorithmFactory_1.RaptorAlgorithmFactory.create(trips, {}, {});
        const query = new RangeQuery_1.RangeQuery(raptor, journeyFactory);
        const result = query.plan(["A"], ["C"], new Date("2018-10-16"));
        util_1.setDefaultTrip(result);
        chai.expect(result).to.deep.equal([
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
        ]);
    });
    /**
     * Unfortunately it is not possible to share the bestArrivals index or the state of the route scanner between
     * departure times in a range query.
     *
     * Consider a journey:
     *
     * A -> B -> C, departing at 1400, arriving at 1500
     *
     * There may be an earlier journey with no changes
     *
     * A -> C, departing at 1359 that arrives at 1501
     *
     * That is rejected because it does not improve the earliest arrival time at C
     */
    it("does not share bestArrivals or routeScanner", () => {
        const trips = [
            util_1.t(util_1.st("A", null, 1359), util_1.st("C", 1501, null)),
            util_1.t(util_1.st("A", null, 1400), util_1.st("B", 1430, null)),
            util_1.t(util_1.st("B", null, 1430), util_1.st("C", 1500, null))
        ];
        const raptor = RaptorAlgorithmFactory_1.RaptorAlgorithmFactory.create(trips, {}, {});
        const query = new RangeQuery_1.RangeQuery(raptor, journeyFactory);
        const result = query.plan(["A"], ["C"], new Date("2018-10-16"));
        util_1.setDefaultTrip(result);
        chai.expect(result).to.deep.equal([
            util_1.j([
                util_1.st("A", null, 1359),
                util_1.st("C", 1501, null)
            ]),
            util_1.j([
                util_1.st("A", null, 1400),
                util_1.st("B", 1430, null)
            ], [
                util_1.st("B", null, 1430),
                util_1.st("C", 1500, null)
            ]),
            util_1.j([
                util_1.st("A", null, 1400),
                util_1.st("B", 1430, null)
            ], [
                util_1.st("B", null, 1430),
                util_1.st("C", 1500, null)
            ]),
        ]);
    });
});
