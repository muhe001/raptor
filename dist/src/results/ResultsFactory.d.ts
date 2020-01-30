import { StopID, Transfer } from "../gtfs/GTFS";
import { Journey } from "./Journey";
import { Connection, ConnectionIndex } from "../raptor/ScanResults";
/**
 * Create results from the kConnections index
 */
export interface ResultsFactory {
    getResults(kConnections: ConnectionIndex, destination: StopID): Journey[];
}
/**
 * Type check for a kConnection connection
 */
export declare function isTransfer(connection: Connection | Transfer): connection is Transfer;
