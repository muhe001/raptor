import { ConnectionIndex } from "../../raptor/ScanResults";
import { StopID } from "../../gtfs/GTFS";
/**
 * Create the results factory
 */
export declare type TransferPatternResultsFactory<T> = () => TransferPatternResults<T>;
/**
 * Transfer pattern results
 */
export interface TransferPatternResults<T> {
    add(kConnections: ConnectionIndex): void;
    finalize(): T;
}
/**
 * A list of stops representing a journeys path
 */
export declare type Path = StopID[];
