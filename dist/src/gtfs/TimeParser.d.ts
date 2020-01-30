/**
 * Parses time strings and returns them as seconds from midnight. Caches results
 */
export declare class TimeParser {
    private readonly timeCache;
    /**
     * Convert a time string to seconds from midnight
     */
    getTime(time: string): any;
}
