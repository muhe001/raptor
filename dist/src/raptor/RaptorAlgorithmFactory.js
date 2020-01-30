"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ServiceUtil_1 = require("../gtfs/ServiceUtil");
const RaptorAlgorithm_1 = require("./RaptorAlgorithm");
const QueueFactory_1 = require("./QueueFactory");
const RouteScanner_1 = require("./RouteScanner");
const DateUtil_1 = require("../query/DateUtil");
const ScanResultsFactory_1 = require("./ScanResultsFactory");
/**
 * Prepares GTFS data for the raptor algorithm
 */
class RaptorAlgorithmFactory {
    /**
     * Set up indexes that are required by the Raptor algorithm. If a date is provided all trips will be pre-filtered
     * before being given to the Raptor class.
     *
     * If a date is passed all trips will be filtered to ensure they run on that date. This improves query performance
     * but reduces flexibility
     */
    static create(trips, transfers, interchange, date) {
        const routesAtStop = {};
        const tripsByRoute = {};
        const routeStopIndex = {};
        const routePath = {};
        const usefulTransfers = {};
        if (date) {
            const dateNumber = DateUtil_1.getDateNumber(date);
            const dow = date.getDay();
            trips = trips.filter(trip => ServiceUtil_1.ServiceUtil.runsOn(trip.service, dateNumber, dow));
        }
        trips.sort((a, b) => a.stopTimes[0].departureTime - b.stopTimes[0].departureTime);
        for (const trip of trips) {
            const path = trip.stopTimes.map(s => s.stop);
            const routeId = this.getRouteId(trip, tripsByRoute);
            if (!routeStopIndex[routeId]) {
                tripsByRoute[routeId] = [];
                routeStopIndex[routeId] = {};
                routePath[routeId] = path;
                for (let i = path.length - 1; i >= 0; i--) {
                    routeStopIndex[routeId][path[i]] = i;
                    usefulTransfers[path[i]] = transfers[path[i]] || [];
                    interchange[path[i]] = interchange[path[i]] || RaptorAlgorithmFactory.DEFAULT_INTERCHANGE_TIME;
                    routesAtStop[path[i]] = routesAtStop[path[i]] || [];
                    if (trip.stopTimes[i].pickUp) {
                        routesAtStop[path[i]].push(routeId);
                    }
                }
            }
            tripsByRoute[routeId].push(trip);
        }
        return new RaptorAlgorithm_1.RaptorAlgorithm(routeStopIndex, routePath, usefulTransfers, interchange, new ScanResultsFactory_1.ScanResultsFactory(Object.keys(usefulTransfers)), new QueueFactory_1.QueueFactory(routesAtStop, routeStopIndex), new RouteScanner_1.RouteScannerFactory(tripsByRoute));
    }
    static getRouteId(trip, tripsByRoute) {
        const routeId = trip.stopTimes.map(s => s.stop + (s.pickUp ? 1 : 0) + (s.dropOff ? 1 : 0)).join();
        for (const t of tripsByRoute[routeId] || []) {
            const arrivalTimeA = trip.stopTimes[trip.stopTimes.length - 1].arrivalTime;
            const arrivalTimeB = t.stopTimes[t.stopTimes.length - 1].arrivalTime;
            if (arrivalTimeA < arrivalTimeB) {
                return routeId + RaptorAlgorithmFactory.OVERTAKING_ROUTE_SUFFIX;
            }
        }
        return routeId;
    }
}
RaptorAlgorithmFactory.DEFAULT_INTERCHANGE_TIME = 0;
RaptorAlgorithmFactory.OVERTAKING_ROUTE_SUFFIX = "overtakes";
exports.RaptorAlgorithmFactory = RaptorAlgorithmFactory;
