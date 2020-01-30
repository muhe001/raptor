import { StopID } from "../gtfs/GTFS";
import { StopTimes } from "./RaptorAlgorithm";
import { ScanResults } from "./ScanResults";
export declare class ScanResultsFactory {
    private readonly stops;
    constructor(stops: StopID[]);
    create(origins: StopTimes): ScanResults;
}
