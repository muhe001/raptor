"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Implementation of the Raptor journey planning algorithm
 */
class RaptorAlgorithm {
    constructor(routeStopIndex, routePath, transfers, interchange, scanResultsFactory, queueFactory, routeScannerFactory) {
        this.routeStopIndex = routeStopIndex;
        this.routePath = routePath;
        this.transfers = transfers;
        this.interchange = interchange;
        this.scanResultsFactory = scanResultsFactory;
        this.queueFactory = queueFactory;
        this.routeScannerFactory = routeScannerFactory;
    }
    /**
     * Perform a plan of the routes at a given time and return the resulting kConnections index
     */
    scan(origins, date, dow) {
        const routeScanner = this.routeScannerFactory.create(date, dow);
        const results = this.scanResultsFactory.create(origins);
        let markedStops = Object.keys(origins);
        while (markedStops.length > 0) {
            results.addRound();
            this.scanRoutes(results, routeScanner, markedStops);
            this.scanTransfers(results, markedStops);
            markedStops = results.getMarkedStops();
        }
        return results.finalize();
    }
    scanRoutes(results, routeScanner, markedStops) {
        const queue = this.queueFactory.getQueue(markedStops);
        for (const [routeId, stopP] of Object.entries(queue)) {
            let boardingPoint = -1;
            let trip = undefined;
            for (let pi = this.routeStopIndex[routeId][stopP]; pi < this.routePath[routeId].length; pi++) {
                const stopPi = this.routePath[routeId][pi];
                const i = this.interchange[stopPi];
                const previousArrival = results.previousArrival(stopPi);
                if (trip && trip.stopTimes[pi].dropOff && trip.stopTimes[pi].arrivalTime + i < results.bestArrival(stopPi)) {
                    results.setTrip(trip, boardingPoint, pi, i);
                }
                else if (previousArrival && (!trip || previousArrival < trip.stopTimes[pi].arrivalTime + i)) {
                    trip = routeScanner.getTrip(routeId, pi, previousArrival);
                    boardingPoint = pi;
                }
            }
        }
    }
    scanTransfers(results, markedStops) {
        for (const stopP of markedStops) {
            for (const transfer of this.transfers[stopP]) {
                const stopPi = transfer.destination;
                const arrival = results.previousArrival(stopP) + transfer.duration + this.interchange[stopPi];
                if (transfer.startTime <= arrival && transfer.endTime >= arrival && arrival < results.bestArrival(stopPi)) {
                    results.setTransfer(transfer, arrival);
                }
            }
        }
    }
}
exports.RaptorAlgorithm = RaptorAlgorithm;
