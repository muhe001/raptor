import { StopID } from "../gtfs/GTFS";
import { RouteID } from "./RouteScanner";
import { RouteStopIndex } from "./RaptorAlgorithm";
/**
 * Create a queue for the Raptor algorithm to use on each iteration of the algorithm.
 */
export declare class QueueFactory {
    private readonly routesAtStop;
    private readonly routeStopIndex;
    constructor(routesAtStop: RoutesIndexedByStop, routeStopIndex: RouteStopIndex);
    /**
     * Take the marked stops and return an index of any routes that pass through those stops.
     */
    getQueue(markedStops: StopID[]): RouteQueue;
    private isStopBefore;
}
declare type RouteQueue = Record<RouteID, StopID>;
declare type RoutesIndexedByStop = Record<StopID, RouteID[]>;
export {};
