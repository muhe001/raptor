"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const DateUtil_1 = require("./DateUtil");
const ts_array_utils_1 = require("ts-array-utils");
/**
 * Implementation of Raptor that searches for journeys between a set of origin and destinations.
 *
 * Only returns results from a single pass of the Raptor algorithm.
 */
class GroupStationDepartAfterQuery {
    constructor(raptor, resultsFactory, maxSearchDays = 3, filters = []) {
        this.raptor = raptor;
        this.resultsFactory = resultsFactory;
        this.maxSearchDays = maxSearchDays;
        this.filters = filters;
    }
    /**
     * Plan a journey between the origin and destination set of stops on the given date and time
     */
    plan(origins, destinations, date, time) {
        // set the departure time for each origin
        const originTimes = origins.reduce(ts_array_utils_1.keyValue(origin => [origin, time]), {});
        // get results for every destination and flatten into a single array
        const results = this.getJourneys(originTimes, destinations, date);
        // apply each filter to the results
        return this.filters.reduce((rs, filter) => filter.apply(rs), results);
    }
    /**
     * Find journeys using the raptor object, if no results are found then increment the day and keep
     * searching until results have been found or the maximum number of days has been reached
     */
    getJourneys(origins, destinations, startDate) {
        const connectionIndexes = [];
        for (let i = 0; i < this.maxSearchDays; i++) {
            const date = DateUtil_1.getDateNumber(startDate);
            const dayOfWeek = startDate.getDay();
            const [kConnections, bestArrivals] = this.raptor.scan(origins, date, dayOfWeek);
            const results = this.getJourneysFromConnections(kConnections, connectionIndexes, destinations);
            if (results.length > 0) {
                return results;
            }
            // reset the origin departure times, and increment the day by one
            origins = this.getFoundStations(kConnections, bestArrivals);
            startDate.setDate(startDate.getDate() + 1);
            connectionIndexes.push(kConnections);
        }
        return [];
    }
    /**
     * Take all the stops we've visited and set the departure time for the next day as the best arrival time at that
     * stop minus 1 day. This prevents invalid departures where the arrival time at a stop is greater than 24 hours
     * e.g. arriving at 28:30 but departing at 04:00 the next day.
     */
    getFoundStations(kConnections, bestArrivals) {
        const allStops = Object.keys(kConnections);
        const stopsWithAnArrival = allStops.filter(d => kConnections[d] && Object.keys(kConnections[d]).length > 0);
        // create the origin departure times by subtracting 1 day from the best arrival time
        return stopsWithAnArrival.reduce(ts_array_utils_1.keyValue(s => [s, Math.max(1, bestArrivals[s] - 86400)]), {});
    }
    /**
     * Create journeys that may span multiple days by stitching together multiple kConnection results
     * into individual journeys.
     */
    getJourneysFromConnections(kConnections, prevConnections, destinations) {
        const destinationsWithResults = destinations.filter(d => kConnections[d] && Object.keys(kConnections[d]).length > 0);
        const initialResults = destinationsWithResults.flatMap(d => this.resultsFactory.getResults(kConnections, d));
        // reverse the previous connections and then work back through each day pre-pending journeys
        return prevConnections
            .reverse()
            .reduce((journeys, connections) => this.completeJourneys(journeys, connections), initialResults);
    }
    /**
     * Reducer that takes the current list of journeys and prepends results based on the given kConnections
     */
    completeJourneys(results, kConnections) {
        // for every results we have so far
        return results.flatMap(journeyB => {
            // find some results to the origin of that result and merge them together
            return this.resultsFactory
                .getResults(kConnections, journeyB.legs[0].origin)
                .map(journeyA => this.mergeJourneys(journeyA, journeyB));
        });
    }
    /**
     * Add journey B to the end of journey A and correct the arrival / departure times
     */
    mergeJourneys(journeyA, journeyB) {
        return {
            legs: journeyA.legs.concat(journeyB.legs),
            departureTime: journeyA.departureTime,
            arrivalTime: journeyB.arrivalTime + 86400
        };
    }
}
exports.GroupStationDepartAfterQuery = GroupStationDepartAfterQuery;
