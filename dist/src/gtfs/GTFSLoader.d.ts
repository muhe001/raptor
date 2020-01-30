/// <reference types="node" />
import { StopIndex, Trip } from "./GTFS";
import { Interchange, TransfersByOrigin } from "../raptor/RaptorAlgorithm";
import { Readable } from "stream";
/**
 * Returns trips, transfers, interchange time and calendars from a GTFS zip.
 */
export declare function loadGTFS(stream: Readable): Promise<GTFSData>;
/**
 * Contents of the GTFS zip file
 */
export declare type GTFSData = [Trip[], TransfersByOrigin, Interchange, StopIndex];
