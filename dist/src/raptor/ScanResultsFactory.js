"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ScanResults_1 = require("./ScanResults");
class ScanResultsFactory {
    constructor(stops) {
        this.stops = stops;
    }
    create(origins) {
        const bestArrivals = {};
        const kArrivals = [{}];
        const kConnections = {};
        for (const stop of this.stops) {
            bestArrivals[stop] = origins[stop] || Number.MAX_SAFE_INTEGER;
            kArrivals[0][stop] = origins[stop] || Number.MAX_SAFE_INTEGER;
            kConnections[stop] = {};
        }
        return new ScanResults_1.ScanResults(bestArrivals, kArrivals, kConnections);
    }
}
exports.ScanResultsFactory = ScanResultsFactory;
