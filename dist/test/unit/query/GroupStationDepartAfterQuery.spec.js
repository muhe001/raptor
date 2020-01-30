"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai = require("chai");
const util_1 = require("../util");
const RaptorAlgorithmFactory_1 = require("../../../src/raptor/RaptorAlgorithmFactory");
const JourneyFactory_1 = require("../../../src/results/JourneyFactory");
const MultipleCriteriaFilter_1 = require("../../../src/results/filter/MultipleCriteriaFilter");
const GroupStationDepartAfterQuery_1 = require("../../../src/query/GroupStationDepartAfterQuery");
describe("GroupStationDepartAfterQuery", () => {
    const journeyFactory = new JourneyFactory_1.JourneyFactory();
    const filters = [new MultipleCriteriaFilter_1.MultipleCriteriaFilter()];
    it("plans to multiple destinations", () => {
        const trips = [
            util_1.t(util_1.st("A", null, 1000), util_1.st("B", 1030, 1035), util_1.st("C", 1100, null)),
            util_1.t(util_1.st("A", null, 1200), util_1.st("B", 1230, 1235), util_1.st("D", 1300, null))
        ];
        const raptor = RaptorAlgorithmFactory_1.RaptorAlgorithmFactory.create(trips, {}, {});
        const query = new GroupStationDepartAfterQuery_1.GroupStationDepartAfterQuery(raptor, journeyFactory, 1, filters);
        const result = query.plan(["A"], ["C", "D"], new Date("2019-04-18"), 900);
        util_1.setDefaultTrip(result);
        chai.expect(result).to.deep.equal([
            util_1.j([
                util_1.st("A", null, 1000),
                util_1.st("B", 1030, 1035),
                util_1.st("C", 1100, null)
            ]),
            util_1.j([
                util_1.st("A", null, 1200),
                util_1.st("B", 1230, 1235),
                util_1.st("D", 1300, null)
            ])
        ]);
    });
    it("plans from multiple origins", () => {
        const trips = [
            util_1.t(util_1.st("A", null, 1000), util_1.st("B", 1030, 1035), util_1.st("C", 1100, null)),
            util_1.t(util_1.st("A", null, 1200), util_1.st("_", 1230, 1235), util_1.st("D", 1300, null))
        ];
        const raptor = RaptorAlgorithmFactory_1.RaptorAlgorithmFactory.create(trips, {}, {});
        const query = new GroupStationDepartAfterQuery_1.GroupStationDepartAfterQuery(raptor, journeyFactory, 1, filters);
        const result = query.plan(["A", "B"], ["C", "D"], new Date("2019-04-18"), 900);
        util_1.setDefaultTrip(result);
        chai.expect(result).to.deep.equal([
            util_1.j([
                util_1.st("B", 1030, 1035),
                util_1.st("C", 1100, null)
            ]),
            util_1.j([
                util_1.st("A", null, 1200),
                util_1.st("_", 1230, 1235),
                util_1.st("D", 1300, null)
            ])
        ]);
    });
});
