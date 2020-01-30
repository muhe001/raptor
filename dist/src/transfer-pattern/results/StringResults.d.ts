import { ConnectionIndex } from "../../raptor/ScanResults";
import { TransferPatternResults } from "./TransferPatternResults";
/**
 * Store the kConnection results as an index where the key is the journey origin and destination and the value is a Set
 * of change points.
 */
export declare class StringResults implements TransferPatternResults<TransferPatternIndex> {
    private results;
    /**
     * Extract the path from each kConnection result and store it in an index
     */
    add(kConnections: ConnectionIndex): void;
    /**
     * Return the results
     */
    finalize(): TransferPatternIndex;
    private getPath;
}
/**
 * Origin + destination.
 */
export declare type JourneyPatternKey = string;
/**
 * Comma separated list of transfer points. The origin and destination stops are omitted.
 */
export declare type JourneyPattern = string;
/**
 * Transfer pattern strings indexed by their journey key.
 */
export declare type TransferPatternIndex = Record<JourneyPatternKey, Set<JourneyPattern>>;
