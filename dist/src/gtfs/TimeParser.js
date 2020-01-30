"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Parses time strings and returns them as seconds from midnight. Caches results
 */
class TimeParser {
    constructor() {
        this.timeCache = {};
    }
    /**
     * Convert a time string to seconds from midnight
     */
    getTime(time) {
        if (!this.timeCache.hasOwnProperty(time)) {
            const [hh, mm, ss] = time.split(":");
            this.timeCache[time] = (+hh) * 60 * 60 + (+mm) * 60 + (+ss);
        }
        return this.timeCache[time];
    }
}
exports.TimeParser = TimeParser;
