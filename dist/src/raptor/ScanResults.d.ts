import { StopID, Time, Transfer, Trip } from "../gtfs/GTFS";
export declare class ScanResults {
    private readonly bestArrivals;
    private readonly kArrivals;
    private readonly kConnections;
    private k;
    constructor(bestArrivals: Arrivals, kArrivals: ArrivalsByNumChanges, kConnections: ConnectionIndex);
    addRound(): void;
    previousArrival(stopPi: StopID): Time;
    setTrip(trip: Trip, startIndex: number, endIndex: number, interchange: number): void;
    setTransfer(transfer: Transfer, time: Time): void;
    bestArrival(stopPi: StopID): Time;
    getMarkedStops(): string[];
    finalize(): [ConnectionIndex, Arrivals];
}
export declare type Arrivals = Record<StopID, Time>;
export declare type ArrivalsByNumChanges = Record<number, Arrivals>;
export declare type Connection = [Trip, number, number];
export declare type ConnectionIndex = Record<StopID, Record<number, Connection | Transfer>>;
