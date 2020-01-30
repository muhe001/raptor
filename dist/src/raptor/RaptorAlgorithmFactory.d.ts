import { Trip } from "../gtfs/GTFS";
import { Interchange, RaptorAlgorithm, TransfersByOrigin } from "./RaptorAlgorithm";
/**
 * Prepares GTFS data for the raptor algorithm
 */
export declare class RaptorAlgorithmFactory {
    private static readonly DEFAULT_INTERCHANGE_TIME;
    private static readonly OVERTAKING_ROUTE_SUFFIX;
    /**
     * Set up indexes that are required by the Raptor algorithm. If a date is provided all trips will be pre-filtered
     * before being given to the Raptor class.
     *
     * If a date is passed all trips will be filtered to ensure they run on that date. This improves query performance
     * but reduces flexibility
     */
    static create(trips: Trip[], transfers: TransfersByOrigin, interchange: Interchange, date?: Date): RaptorAlgorithm;
    private static getRouteId;
}
