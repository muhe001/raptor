"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ResultsFactory_1 = require("../../results/ResultsFactory");
/**
 * Store the kConnection results as an index where the key is the journey origin and destination and the value is a Set
 * of change points.
 */
class StringResults {
    constructor() {
        this.results = {};
    }
    /**
     * Extract the path from each kConnection result and store it in an index
     */
    add(kConnections) {
        for (const destination in kConnections) {
            for (const k in kConnections[destination]) {
                const path = this.getPath(kConnections, k, destination);
                if (path.length > 1) {
                    const [origin, ...tail] = path;
                    const journeyKey = origin > destination ? destination + origin : origin + destination;
                    const pathString = origin > destination ? tail.reverse().join() : tail.join();
                    this.results[journeyKey] = this.results[journeyKey] || new Set();
                    this.results[journeyKey].add(pathString);
                }
            }
        }
    }
    /**
     * Return the results
     */
    finalize() {
        return this.results;
    }
    getPath(kConnections, k, finalDestination) {
        let path = [];
        for (let destination = finalDestination, i = parseInt(k, 10); i > 0; i--) {
            const connection = kConnections[destination][i];
            const origin = ResultsFactory_1.isTransfer(connection) ? connection.origin : connection[0].stopTimes[connection[1]].stop;
            path.unshift(origin);
            destination = origin;
        }
        return path;
    }
}
exports.StringResults = StringResults;
