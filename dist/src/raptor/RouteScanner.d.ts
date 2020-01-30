import { DayOfWeek, Time, Trip } from "../gtfs/GTFS";
/**
 * Returns trips for specific routes. Maintains a reference to the last trip returned in order to reduce plan time.
 */
export declare class RouteScanner {
    private readonly tripsByRoute;
    private readonly date;
    private readonly dow;
    private readonly routeScanPosition;
    constructor(tripsByRoute: TripsIndexedByRoute, date: number, dow: DayOfWeek);
    /**
     * Return the earliest trip stop times possible on the given route
     */
    getTrip(routeId: RouteID, stopIndex: number, time: Time): Trip | undefined;
}
/**
 * Create the RouteScanner from GTFS trips and calendars
 */
export declare class RouteScannerFactory {
    private readonly tripsByRoute;
    constructor(tripsByRoute: TripsIndexedByRoute);
    create(date: number, dow: DayOfWeek): RouteScanner;
}
export declare type RouteID = string;
export declare type TripsIndexedByRoute = Record<RouteID, Trip[]>;
