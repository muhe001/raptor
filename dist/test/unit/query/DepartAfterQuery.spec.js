"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai = require("chai");
const JourneyFactory_1 = require("../../../src/results/JourneyFactory");
const util_1 = require("../util");
const RaptorAlgorithmFactory_1 = require("../../../src/raptor/RaptorAlgorithmFactory");
const DepartAfterQuery_1 = require("../../../src/query/DepartAfterQuery");
describe("DepartAfterQuery", () => {
    const journeyFactory = new JourneyFactory_1.JourneyFactory();
    it("finds journeys with direct connections", () => {
        const trips = [
            util_1.t(util_1.st("A", null, 1000), util_1.st("B", 1030, 1035), util_1.st("C", 1100, null))
        ];
        const raptor = RaptorAlgorithmFactory_1.RaptorAlgorithmFactory.create(trips, {}, {});
        const query = new DepartAfterQuery_1.DepartAfterQuery(raptor, journeyFactory);
        const result = query.plan("A", "C", new Date("2018-10-16"), 900);
        util_1.setDefaultTrip(result);
        chai.expect(result).to.deep.equal([
            util_1.j([
                util_1.st("A", null, 1000),
                util_1.st("B", 1030, 1035),
                util_1.st("C", 1100, null)
            ])
        ]);
    });
    it("finds the earliest calendars", () => {
        const trips = [
            util_1.t(util_1.st("A", null, 1400), util_1.st("B", 1430, 1435), util_1.st("C", 1500, null)),
            util_1.t(util_1.st("A", null, 1000), util_1.st("B", 1030, 1035), util_1.st("C", 1100, null))
        ];
        const raptor = RaptorAlgorithmFactory_1.RaptorAlgorithmFactory.create(trips, {}, {});
        const query = new DepartAfterQuery_1.DepartAfterQuery(raptor, journeyFactory);
        const result = query.plan("A", "C", new Date("2018-10-16"), 900);
        util_1.setDefaultTrip(result);
        chai.expect(result).to.deep.equal([
            util_1.j([
                util_1.st("A", null, 1000),
                util_1.st("B", 1030, 1035),
                util_1.st("C", 1100, null)
            ])
        ]);
    });
    it("finds journeys with a single connection", () => {
        const trips = [
            util_1.t(util_1.st("A", null, 1000), util_1.st("B", 1030, 1035), util_1.st("C", 1100, null)),
            util_1.t(util_1.st("D", null, 1000), util_1.st("B", 1030, 1035), util_1.st("E", 1100, null))
        ];
        const raptor = RaptorAlgorithmFactory_1.RaptorAlgorithmFactory.create(trips, {}, {});
        const query = new DepartAfterQuery_1.DepartAfterQuery(raptor, journeyFactory);
        const result = query.plan("A", "E", new Date("2018-10-16"), 900);
        util_1.setDefaultTrip(result);
        chai.expect(result).to.deep.equal([
            util_1.j([
                util_1.st("A", null, 1000),
                util_1.st("B", 1030, 1035),
            ], [
                util_1.st("B", 1030, 1035),
                util_1.st("E", 1100, null)
            ])
        ]);
    });
    it("does not return journeys that cannot be made", () => {
        const trips = [
            util_1.t(util_1.st("A", null, 1000), util_1.st("B", 1035, 1035), util_1.st("C", 1100, null)),
            util_1.t(util_1.st("D", null, 1000), util_1.st("B", 1030, 1030), util_1.st("E", 1100, null))
        ];
        const raptor = RaptorAlgorithmFactory_1.RaptorAlgorithmFactory.create(trips, {}, {});
        const query = new DepartAfterQuery_1.DepartAfterQuery(raptor, journeyFactory, 1);
        const result = query.plan("A", "E", new Date("2018-10-16"), 900);
        util_1.setDefaultTrip(result);
        chai.expect(result).to.deep.equal([]);
    });
    it("returns the fastest and the least changes", () => {
        const trips = [
            util_1.t(util_1.st("A", null, 1000), util_1.st("B", 1030, 1030), util_1.st("C", 1200, null)),
            util_1.t(util_1.st("B", null, 1030), util_1.st("C", 1100, null))
        ];
        const raptor = RaptorAlgorithmFactory_1.RaptorAlgorithmFactory.create(trips, {}, {});
        const query = new DepartAfterQuery_1.DepartAfterQuery(raptor, journeyFactory);
        const result = query.plan("A", "C", new Date("2018-10-16"), 900);
        util_1.setDefaultTrip(result);
        const direct = util_1.j([
            util_1.st("A", null, 1000),
            util_1.st("B", 1030, 1030),
            util_1.st("C", 1200, null)
        ]);
        const change = util_1.j([
            util_1.st("A", null, 1000),
            util_1.st("B", 1030, 1030),
        ], [
            util_1.st("B", null, 1030),
            util_1.st("C", 1100, null)
        ]);
        chai.expect(result).to.deep.equal([
            direct,
            change
        ]);
    });
    it("chooses the fastest journey where the number of journeys is the same", () => {
        const trips = [
            util_1.t(util_1.st("A", null, 1000), util_1.st("B", 1030, 1030), util_1.st("C", 1100, null)),
            util_1.t(util_1.st("C", null, 1200), util_1.st("D", 1230, 1230), util_1.st("E", 1300, null)),
            util_1.t(util_1.st("A", null, 1100), util_1.st("F", 1130, 1130), util_1.st("G", 1200, null)),
            util_1.t(util_1.st("G", null, 1200), util_1.st("H", 1230, 1230), util_1.st("E", 1255, null)),
        ];
        const raptor = RaptorAlgorithmFactory_1.RaptorAlgorithmFactory.create(trips, {}, {});
        const query = new DepartAfterQuery_1.DepartAfterQuery(raptor, journeyFactory);
        const result = query.plan("A", "E", new Date("2018-10-16"), 900);
        util_1.setDefaultTrip(result);
        const fastest = util_1.j([
            util_1.st("A", null, 1100),
            util_1.st("F", 1130, 1130),
            util_1.st("G", 1200, null)
        ], [
            util_1.st("G", null, 1200),
            util_1.st("H", 1230, 1230),
            util_1.st("E", 1255, null)
        ]);
        chai.expect(result).to.deep.equal([
            fastest
        ]);
    });
    it("chooses an arbitrary journey when they are the same", () => {
        const trips = [
            util_1.t(util_1.st("A", null, 1000), util_1.st("B", 1030, 1030), util_1.st("C", 1100, null)),
            util_1.t(util_1.st("C", null, 1200), util_1.st("D", 1230, 1230), util_1.st("E", 1300, null)),
            util_1.t(util_1.st("A", null, 1100), util_1.st("F", 1130, 1130), util_1.st("G", 1200, null)),
            util_1.t(util_1.st("G", null, 1200), util_1.st("H", 1230, 1230), util_1.st("E", 1300, null)),
        ];
        const raptor = RaptorAlgorithmFactory_1.RaptorAlgorithmFactory.create(trips, {}, {});
        const query = new DepartAfterQuery_1.DepartAfterQuery(raptor, journeyFactory);
        const result = query.plan("A", "E", new Date("2018-10-16"), 900);
        util_1.setDefaultTrip(result);
        const journey1 = util_1.j([
            util_1.st("A", null, 1000),
            util_1.st("B", 1030, 1030),
            util_1.st("C", 1100, null)
        ], [
            util_1.st("C", null, 1200),
            util_1.st("D", 1230, 1230),
            util_1.st("E", 1300, null)
        ]);
        chai.expect(result).to.deep.equal([
            journey1
        ]);
    });
    it("chooses the correct change point", () => {
        const trips = [
            util_1.t(util_1.st("A", null, 1000), util_1.st("B", 1030, null)),
            util_1.t(util_1.st("A", null, 1030), util_1.st("C", 1200, null)),
            util_1.t(util_1.st("C", null, 1000), util_1.st("B", 1030, 1030), util_1.st("E", 1100, null)),
            util_1.t(util_1.st("C", null, 1200), util_1.st("B", 1230, 1230), util_1.st("E", 1300, null)),
        ];
        const raptor = RaptorAlgorithmFactory_1.RaptorAlgorithmFactory.create(trips, {}, {});
        const query = new DepartAfterQuery_1.DepartAfterQuery(raptor, journeyFactory);
        const result = query.plan("A", "E", new Date("2018-10-16"), 900);
        util_1.setDefaultTrip(result);
        const change = util_1.j([
            util_1.st("A", null, 1000),
            util_1.st("B", 1030, null)
        ], [
            util_1.st("B", 1030, 1030),
            util_1.st("E", 1100, null)
        ]);
        chai.expect(result).to.deep.equal([
            change
        ]);
    });
    it("finds journeys with a transfer", () => {
        const trips = [
            util_1.t(util_1.st("A", null, 1000), util_1.st("B", 1030, 1035), util_1.st("C", 1100, null)),
            util_1.t(util_1.st("D", null, 1200), util_1.st("E", 1300, null))
        ];
        const transfers = {
            "C": [
                util_1.tf("C", "D", 10)
            ]
        };
        const raptor = RaptorAlgorithmFactory_1.RaptorAlgorithmFactory.create(trips, transfers, {});
        const query = new DepartAfterQuery_1.DepartAfterQuery(raptor, journeyFactory);
        const result = query.plan("A", "E", new Date("2018-10-16"), 900);
        util_1.setDefaultTrip(result);
        chai.expect(result).to.deep.equal([
            util_1.j([
                util_1.st("A", null, 1000),
                util_1.st("B", 1030, 1035),
                util_1.st("C", 1100, null)
            ], util_1.tf("C", "D", 10), [
                util_1.st("D", null, 1200),
                util_1.st("E", 1300, null)
            ])
        ]);
    });
    it("uses a transfer if it is faster", () => {
        const trips = [
            util_1.t(util_1.st("A", null, 1000), util_1.st("B", 1030, 1030), util_1.st("C", 1100, null)),
            util_1.t(util_1.st("C", null, 1130), util_1.st("D", 1200, null))
        ];
        const transfers = {
            "C": [
                util_1.tf("C", "D", 10)
            ]
        };
        const raptor = RaptorAlgorithmFactory_1.RaptorAlgorithmFactory.create(trips, transfers, {});
        const query = new DepartAfterQuery_1.DepartAfterQuery(raptor, journeyFactory);
        const result = query.plan("A", "D", new Date("2018-10-16"), 900);
        util_1.setDefaultTrip(result);
        const transfer = util_1.j([
            util_1.st("A", null, 1000),
            util_1.st("B", 1030, 1030),
            util_1.st("C", 1100, null)
        ], util_1.tf("C", "D", 10));
        chai.expect(result).to.deep.equal([
            transfer
        ]);
    });
    it("doesn't allow pick up from locations without pickup specified", () => {
        const trips = [
            util_1.t(util_1.st("A", null, 1000), util_1.st("B", 1030, 1030), util_1.st("C", 1200, null)),
            util_1.t(util_1.st("E", null, 1000), util_1.st("B", 1030, null), util_1.st("C", 1100, null))
        ];
        const raptor = RaptorAlgorithmFactory_1.RaptorAlgorithmFactory.create(trips, {}, {});
        const query = new DepartAfterQuery_1.DepartAfterQuery(raptor, journeyFactory);
        const result = query.plan("A", "C", new Date("2018-10-16"), 900);
        util_1.setDefaultTrip(result);
        const direct = util_1.j([
            util_1.st("A", null, 1000),
            util_1.st("B", 1030, 1030),
            util_1.st("C", 1200, null)
        ]);
        chai.expect(result).to.deep.equal([
            direct
        ]);
    });
    it("doesn't allow drop off at non-drop off locations", () => {
        const trips = [
            util_1.t(util_1.st("A", null, 1000), util_1.st("B", null, 1030), util_1.st("C", 1200, null)),
            util_1.t(util_1.st("E", null, 1000), util_1.st("B", 1030, 1030), util_1.st("C", 1100, null))
        ];
        const raptor = RaptorAlgorithmFactory_1.RaptorAlgorithmFactory.create(trips, {}, {});
        const query = new DepartAfterQuery_1.DepartAfterQuery(raptor, journeyFactory);
        const result = query.plan("A", "C", new Date("2018-10-16"), 900);
        util_1.setDefaultTrip(result);
        const direct = util_1.j([
            util_1.st("A", null, 1000),
            util_1.st("B", null, 1030),
            util_1.st("C", 1200, null)
        ]);
        chai.expect(result).to.deep.equal([
            direct
        ]);
    });
    it("applies interchange times", () => {
        const trips = [
            util_1.t(util_1.st("A", null, 1000), util_1.st("B", 1030, 1030), util_1.st("C", 1200, null)),
            util_1.t(util_1.st("B", null, 1030), util_1.st("C", 1100, null)),
            util_1.t(util_1.st("B", null, 1040), util_1.st("C", 1110, null))
        ];
        const transfers = {};
        const interchange = { B: 10 };
        const raptor = RaptorAlgorithmFactory_1.RaptorAlgorithmFactory.create(trips, transfers, interchange);
        const query = new DepartAfterQuery_1.DepartAfterQuery(raptor, journeyFactory);
        const result = query.plan("A", "C", new Date("2018-10-16"), 900);
        util_1.setDefaultTrip(result);
        const direct = util_1.j([
            util_1.st("A", null, 1000),
            util_1.st("B", 1030, 1030),
            util_1.st("C", 1200, null)
        ]);
        const change = util_1.j([
            util_1.st("A", null, 1000),
            util_1.st("B", 1030, 1030),
        ], [
            util_1.st("B", null, 1040),
            util_1.st("C", 1110, null)
        ]);
        chai.expect(result).to.deep.equal([
            direct,
            change
        ]);
    });
    it("applies interchange times to transfers", () => {
        const trips = [
            util_1.t(util_1.st("A", null, 1000), util_1.st("B", 1030, null)),
            util_1.t(util_1.st("C", null, 1030), util_1.st("D", 1100, null)),
            util_1.t(util_1.st("C", null, 1050), util_1.st("D", 1110, null)),
            util_1.t(util_1.st("C", null, 1100), util_1.st("D", 1120, null))
        ];
        const transfers = {
            "B": [
                util_1.tf("B", "C", 10)
            ]
        };
        const interchange = { B: 10, C: 10 };
        const raptor = RaptorAlgorithmFactory_1.RaptorAlgorithmFactory.create(trips, transfers, interchange);
        const query = new DepartAfterQuery_1.DepartAfterQuery(raptor, journeyFactory);
        const result = query.plan("A", "D", new Date("2018-10-16"), 900);
        util_1.setDefaultTrip(result);
        const lastPossible = util_1.j([
            util_1.st("A", null, 1000),
            util_1.st("B", 1030, null),
        ], util_1.tf("B", "C", 10), [
            util_1.st("C", null, 1100),
            util_1.st("D", 1120, null)
        ]);
        chai.expect(result).to.deep.equal([
            lastPossible
        ]);
    });
    it("omits calendars not running that day", () => {
        const trip = util_1.t(util_1.st("B", null, 1030), util_1.st("C", 1100, null));
        trip.service = {
            startDate: 20181001,
            endDate: 20181015,
            days: util_1.allDays,
            dates: {}
        };
        const trips = [
            util_1.t(util_1.st("A", null, 1000), util_1.st("B", 1030, null)),
            trip,
            util_1.t(util_1.st("B", null, 1040), util_1.st("C", 1110, null))
        ];
        const transfers = {};
        const interchange = {};
        const raptor = RaptorAlgorithmFactory_1.RaptorAlgorithmFactory.create(trips, transfers, interchange);
        const query = new DepartAfterQuery_1.DepartAfterQuery(raptor, journeyFactory);
        const result = query.plan("A", "C", new Date("2018-10-16"), 900);
        util_1.setDefaultTrip(result);
        const change = util_1.j([
            util_1.st("A", null, 1000),
            util_1.st("B", 1030, null),
        ], [
            util_1.st("B", null, 1040),
            util_1.st("C", 1110, null)
        ]);
        chai.expect(result).to.deep.equal([
            change
        ]);
    });
    it("omits calendars not running that day of the week", () => {
        const trip = util_1.t(util_1.st("B", null, 1030), util_1.st("C", 1100, null));
        const days = Object.assign({}, util_1.allDays, { 1: false });
        trip.service = {
            startDate: 20181001,
            endDate: 20991231,
            days,
            dates: {}
        };
        const trips = [
            util_1.t(util_1.st("A", null, 1000), util_1.st("B", 1030, null)),
            trip,
            util_1.t(util_1.st("B", null, 1040), util_1.st("C", 1110, null))
        ];
        const transfers = {};
        const interchange = {};
        const raptor = RaptorAlgorithmFactory_1.RaptorAlgorithmFactory.create(trips, transfers, interchange);
        const query = new DepartAfterQuery_1.DepartAfterQuery(raptor, journeyFactory);
        const result = query.plan("A", "C", new Date("2018-10-22"), 900);
        util_1.setDefaultTrip(result);
        const change = util_1.j([
            util_1.st("A", null, 1000),
            util_1.st("B", 1030, null),
        ], [
            util_1.st("B", null, 1040),
            util_1.st("C", 1110, null)
        ]);
        chai.expect(result).to.deep.equal([
            change
        ]);
    });
    it("includes calendars with an include day", () => {
        const trip = util_1.t(util_1.st("B", null, 1030), util_1.st("C", 1100, null));
        trip.service = {
            startDate: 20991231,
            endDate: 20991231,
            days: util_1.allDays,
            dates: { 20181022: true }
        };
        const trips = [
            util_1.t(util_1.st("A", null, 1000), util_1.st("B", 1030, null)),
            trip,
            util_1.t(util_1.st("B", null, 1040), util_1.st("C", 1110, null))
        ];
        const transfers = {};
        const interchange = {};
        const raptor = RaptorAlgorithmFactory_1.RaptorAlgorithmFactory.create(trips, transfers, interchange);
        const query = new DepartAfterQuery_1.DepartAfterQuery(raptor, journeyFactory);
        const result = query.plan("A", "C", new Date("2018-10-22"), 900);
        util_1.setDefaultTrip(result);
        const change = util_1.j([
            util_1.st("A", null, 1000),
            util_1.st("B", 1030, null),
        ], [
            util_1.st("B", null, 1030),
            util_1.st("C", 1100, null)
        ]);
        chai.expect(result).to.deep.equal([
            change
        ]);
    });
    it("omits calendars with an exclude day", () => {
        const trip = util_1.t(util_1.st("B", null, 1030), util_1.st("C", 1100, null));
        trip.service = {
            startDate: 20181001,
            endDate: 20991231,
            days: util_1.allDays,
            dates: { 20181022: false }
        };
        const trips = [
            util_1.t(util_1.st("A", null, 1000), util_1.st("B", 1030, null)),
            trip,
            util_1.t(util_1.st("B", null, 1040), util_1.st("C", 1110, null))
        ];
        const transfers = {};
        const interchange = {};
        const raptor = RaptorAlgorithmFactory_1.RaptorAlgorithmFactory.create(trips, transfers, interchange);
        const query = new DepartAfterQuery_1.DepartAfterQuery(raptor, journeyFactory);
        const result = query.plan("A", "C", new Date("2018-10-22"), 900);
        util_1.setDefaultTrip(result);
        const change = util_1.j([
            util_1.st("A", null, 1000),
            util_1.st("B", 1030, null),
        ], [
            util_1.st("B", null, 1040),
            util_1.st("C", 1110, null)
        ]);
        chai.expect(result).to.deep.equal([
            change
        ]);
    });
    it("finds journeys after gaps in rounds", () => {
        const trips = [
            util_1.t(util_1.st("A", null, 1000), util_1.st("B", 1030, 1035), util_1.st("C", 1400, null)),
            util_1.t(util_1.st("B", null, 1035), util_1.st("D", 1100, null)),
            util_1.t(util_1.st("D", null, 1100), util_1.st("E", 1130, null)),
            util_1.t(util_1.st("E", null, 1130), util_1.st("C", 1200, null)),
            util_1.t(util_1.st("A", null, 1000), util_1.st("E", 1135, null)),
            util_1.t(util_1.st("E", null, 1135), util_1.st("C", 1330, null)),
        ];
        const raptor = RaptorAlgorithmFactory_1.RaptorAlgorithmFactory.create(trips, {}, {});
        const query = new DepartAfterQuery_1.DepartAfterQuery(raptor, journeyFactory);
        const result = query.plan("A", "C", new Date("2018-10-16"), 900);
        util_1.setDefaultTrip(result);
        const direct = util_1.j([
            util_1.st("A", null, 1000),
            util_1.st("B", 1030, 1035),
            util_1.st("C", 1400, null)
        ]);
        const slowChange = util_1.j([
            util_1.st("A", null, 1000),
            util_1.st("E", 1135, null)
        ], [
            util_1.st("E", null, 1135),
            util_1.st("C", 1330, null)
        ]);
        const change = util_1.j([
            util_1.st("A", null, 1000),
            util_1.st("B", 1030, 1035)
        ], [
            util_1.st("B", null, 1035),
            util_1.st("D", 1100, null)
        ], [
            util_1.st("D", null, 1100),
            util_1.st("E", 1130, null)
        ], [
            util_1.st("E", null, 1130),
            util_1.st("C", 1200, null)
        ]);
        chai.expect(result).to.deep.equal([
            direct,
            slowChange,
            change
        ]);
    });
    it("puts overtaken trains in different routes", () => {
        const trips = [
            util_1.t(util_1.st("A", null, 1000), util_1.st("B", 1030, 1030), util_1.st("C", 1100, 1110), util_1.st("D", 1130, 1130), util_1.st("E", 1200, null)),
            util_1.t(util_1.st("A", null, 1010), util_1.st("B", 1040, 1040), util_1.st("C", 1050, 1100), util_1.st("D", 1120, 1120), util_1.st("E", 1150, null)),
        ];
        const raptor = RaptorAlgorithmFactory_1.RaptorAlgorithmFactory.create(trips, {}, {});
        const query = new DepartAfterQuery_1.DepartAfterQuery(raptor, journeyFactory);
        const result = query.plan("A", "E", new Date("2018-10-16"), 900);
        util_1.setDefaultTrip(result);
        const faster = util_1.j([
            util_1.st("A", null, 1010),
            util_1.st("B", 1040, 1040),
            util_1.st("C", 1050, 1100),
            util_1.st("D", 1120, 1120),
            util_1.st("E", 1150, null)
        ]);
        chai.expect(result).to.deep.equal([
            faster
        ]);
    });
    it("finds journeys that can only be made by waiting for the next day", () => {
        const trips = [
            util_1.t(util_1.st("A", null, 1000), util_1.st("B", 1035, 1035), util_1.st("C", 1100, null)),
            util_1.t(util_1.st("D", null, 1000), util_1.st("B", 1030, 1030), util_1.st("E", 1100, null))
        ];
        const raptor = RaptorAlgorithmFactory_1.RaptorAlgorithmFactory.create(trips, {}, {});
        const query = new DepartAfterQuery_1.DepartAfterQuery(raptor, journeyFactory, 2);
        const result = query.plan("A", "E", new Date("2018-10-16"), 900);
        util_1.setDefaultTrip(result);
        const expected = util_1.j([
            util_1.st("A", null, 1000),
            util_1.st("B", 1035, 1035),
        ], [
            util_1.st("B", 1030, 1030),
            util_1.st("E", 1100, null)
        ]);
        chai.expect(result[0].legs).to.deep.equal(expected.legs);
    });
    it("adds a day to the arrival time of journeys that are made overnight", () => {
        const trips = [
            util_1.t(util_1.st("A", null, 1000), util_1.st("B", 1035, 1035), util_1.st("C", 1100, null)),
            util_1.t(util_1.st("D", null, 1000), util_1.st("B", 1030, 1030), util_1.st("E", 1100, null))
        ];
        const raptor = RaptorAlgorithmFactory_1.RaptorAlgorithmFactory.create(trips, {}, {});
        const query = new DepartAfterQuery_1.DepartAfterQuery(raptor, journeyFactory, 2);
        const result = query.plan("A", "E", new Date("2018-10-16"), 900);
        util_1.setDefaultTrip(result);
        chai.expect(result[0].arrivalTime).to.equal(1100 + 86400);
    });
    it("increments the day when searching subsequent days", () => {
        const trips = [
            util_1.t(util_1.st("A", null, 1000), util_1.st("B", 1030, 1030), util_1.st("C", 1100, null)),
            util_1.t(util_1.st("D", null, 1000), util_1.st("B", 1035, 1035), util_1.st("E", 1100, null))
        ];
        trips[1].service = util_1.services["2"];
        const raptor = RaptorAlgorithmFactory_1.RaptorAlgorithmFactory.create(trips, {}, {});
        const query = new DepartAfterQuery_1.DepartAfterQuery(raptor, journeyFactory, 2);
        const result = query.plan("A", "E", new Date("2018-12-31"), 900);
        util_1.setDefaultTrip(result);
        chai.expect(result[0].arrivalTime).to.equal(1100 + 86400);
    });
    it("uses all results from every day", () => {
        const trips = [
            util_1.t(util_1.st("A", null, 1900), util_1.st("B", 1930, 1935), util_1.st("C", 2000, null)),
            util_1.t(util_1.st("B", null, 1035), util_1.st("D", 1100, null)),
            util_1.t(util_1.st("D", null, 1100), util_1.st("E", 1130, null)),
            util_1.t(util_1.st("C", null, 1130), util_1.st("E", 1200, null))
        ];
        const raptor = RaptorAlgorithmFactory_1.RaptorAlgorithmFactory.create(trips, {}, {});
        const query = new DepartAfterQuery_1.DepartAfterQuery(raptor, journeyFactory, 2);
        const result = query.plan("A", "E", new Date("2019-04-23"), 900);
        util_1.setDefaultTrip(result);
        const change = util_1.j([
            util_1.st("A", null, 1900),
            util_1.st("B", 1930, 1935)
        ], [
            util_1.st("B", null, 1035),
            util_1.st("D", 1100, null)
        ], [
            util_1.st("D", null, 1100),
            util_1.st("E", 1130, null)
        ]);
        const noChange = util_1.j([
            util_1.st("A", null, 1900),
            util_1.st("B", 1930, 1935),
            util_1.st("C", 2000, null)
        ], [
            util_1.st("C", null, 1130),
            util_1.st("E", 1200, null)
        ]);
        const expected = [
            noChange,
            change,
        ];
        expected.forEach(journey => journey.arrivalTime += 86400);
        chai.expect(result).to.deep.equal(expected);
    });
    it("does not return overnight journeys that cannot be made", () => {
        const trips = [
            util_1.t(util_1.st("A", null, 86000), util_1.st("B", 86400, 86400), util_1.st("C", 86400 + 3600 + 3600, null)),
            util_1.t(util_1.st("C", null, 3600), util_1.st("D", 3635, 3635), util_1.st("E", 3700, null)),
            util_1.t(util_1.st("C", null, 3600 + 3600), util_1.st("D", 3635 + 3600, 3635 + 3600), util_1.st("E", 3700 + 3600, null))
        ];
        const raptor = RaptorAlgorithmFactory_1.RaptorAlgorithmFactory.create(trips, {}, {});
        const query = new DepartAfterQuery_1.DepartAfterQuery(raptor, journeyFactory, 2);
        const result = query.plan("A", "E", new Date("2018-12-31"), 50000);
        util_1.setDefaultTrip(result);
        chai.expect(result[0].arrivalTime).to.equal(86400 + 3700 + 3600);
    });
});
