"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const GroupStationDepartAfterQuery_1 = require("./GroupStationDepartAfterQuery");
/**
 * Implementation of Raptor that searches for journeys departing after a specific time.
 *
 * Only returns results from a single pass of the Raptor algorithm.
 */
class DepartAfterQuery {
    constructor(raptor, resultsFactory, maxSearchDays = 3) {
        this.raptor = raptor;
        this.resultsFactory = resultsFactory;
        this.maxSearchDays = maxSearchDays;
        this.groupQuery = new GroupStationDepartAfterQuery_1.GroupStationDepartAfterQuery(raptor, resultsFactory, maxSearchDays);
    }
    /**
     * Plan a journey between the origin and destination on the given date and time.
     *
     * This method delegates the call to a GroupStationDepartAfterQuery where the origin and
     * destination sets are just a single station.
     *
     * No filters are applied.
     */
    plan(origin, destination, date, time) {
        return this.groupQuery.plan([origin], [destination], date, time);
    }
}
exports.DepartAfterQuery = DepartAfterQuery;
