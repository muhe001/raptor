"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ServiceUtil_1 = require("../gtfs/ServiceUtil");
/**
 * Returns trips for specific routes. Maintains a reference to the last trip returned in order to reduce plan time.
 */
class RouteScanner {
    constructor(tripsByRoute, date, dow) {
        this.tripsByRoute = tripsByRoute;
        this.date = date;
        this.dow = dow;
        this.routeScanPosition = {};
    }
    /**
     * Return the earliest trip stop times possible on the given route
     */
    getTrip(routeId, stopIndex, time) {
        if (!this.routeScanPosition.hasOwnProperty(routeId)) {
            this.routeScanPosition[routeId] = this.tripsByRoute[routeId].length - 1;
        }
        let lastFound;
        // iterate backwards through the trips on the route, starting where we last found a trip
        for (let i = this.routeScanPosition[routeId]; i >= 0; i--) {
            const trip = this.tripsByRoute[routeId][i];
            // if the trip is unreachable, exit the loop
            if (trip.stopTimes[stopIndex].departureTime < time) {
                break;
            }
            // if it is reachable and the service is running that day, update the last valid trip found
            else if (ServiceUtil_1.ServiceUtil.runsOn(trip.service, this.date, this.dow)) {
                lastFound = trip;
            }
            // if we found a trip, update the last found index, if we still haven't found a trip we can also update the
            // last found index as any subsequent scans will be for an earlier time. We can't update the index every time
            // as there may be some services that are reachable but not running before the last found service and searching
            // must continue from the last reachable point.
            if (!lastFound || lastFound === trip) {
                this.routeScanPosition[routeId] = i;
            }
        }
        return lastFound;
    }
}
exports.RouteScanner = RouteScanner;
/**
 * Create the RouteScanner from GTFS trips and calendars
 */
class RouteScannerFactory {
    constructor(tripsByRoute) {
        this.tripsByRoute = tripsByRoute;
    }
    create(date, dow) {
        return new RouteScanner(this.tripsByRoute, date, dow);
    }
}
exports.RouteScannerFactory = RouteScannerFactory;
