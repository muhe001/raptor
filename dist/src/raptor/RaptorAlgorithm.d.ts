import { DayOfWeek, StopID, Time, Transfer } from "../gtfs/GTFS";
import { QueueFactory } from "./QueueFactory";
import { RouteID, RouteScannerFactory } from "./RouteScanner";
import { Arrivals, ConnectionIndex } from "./ScanResults";
import { ScanResultsFactory } from "./ScanResultsFactory";
/**
 * Implementation of the Raptor journey planning algorithm
 */
export declare class RaptorAlgorithm {
    private readonly routeStopIndex;
    private readonly routePath;
    private readonly transfers;
    private readonly interchange;
    private readonly scanResultsFactory;
    private readonly queueFactory;
    private readonly routeScannerFactory;
    constructor(routeStopIndex: RouteStopIndex, routePath: RoutePaths, transfers: TransfersByOrigin, interchange: Interchange, scanResultsFactory: ScanResultsFactory, queueFactory: QueueFactory, routeScannerFactory: RouteScannerFactory);
    /**
     * Perform a plan of the routes at a given time and return the resulting kConnections index
     */
    scan(origins: StopTimes, date: number, dow: DayOfWeek): [ConnectionIndex, Arrivals];
    private scanRoutes;
    private scanTransfers;
}
export declare type RouteStopIndex = Record<RouteID, Record<StopID, number>>;
export declare type RoutePaths = Record<RouteID, StopID[]>;
export declare type Interchange = Record<StopID, Time>;
export declare type TransfersByOrigin = Record<StopID, Transfer[]>;
export declare type StopTimes = Record<StopID, Time>;
