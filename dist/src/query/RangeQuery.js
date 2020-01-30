"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const GroupStationDepartAfterQuery_1 = require("./GroupStationDepartAfterQuery");
/**
 * Use the Raptor algorithm to generate a full day of results.
 */
class RangeQuery {
    constructor(raptor, resultsFactory, maxSearchDays = 3, filters = []) {
        this.raptor = raptor;
        this.resultsFactory = resultsFactory;
        this.maxSearchDays = maxSearchDays;
        this.filters = filters;
        this.ONE_DAY = 24 * 60 * 60;
        this.groupQuery = new GroupStationDepartAfterQuery_1.GroupStationDepartAfterQuery(raptor, resultsFactory, maxSearchDays);
    }
    /**
     * Perform a query at midnight, and then continue to search one minute after the earliest departure of each set of
     * results.
     */
    plan(origins, destinations, date, time = 1, endTime = this.ONE_DAY) {
        const results = [];
        while (time < endTime) {
            const newResults = this.groupQuery.plan(origins, destinations, date, time);
            results.push(...newResults);
            if (newResults.length === 0) {
                break;
            }
            time = Math.min(...newResults.map(j => j.departureTime)) + 1;
        }
        return this.filters.reduce((rs, filter) => filter.apply(rs), results);
    }
}
exports.RangeQuery = RangeQuery;
