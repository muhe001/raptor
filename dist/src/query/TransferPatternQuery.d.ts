import { RaptorAlgorithm } from "../raptor/RaptorAlgorithm";
import { StopID } from "../gtfs/GTFS";
import { TransferPatternResultsFactory } from "../transfer-pattern/results/TransferPatternResults";
/**
 * Uses the Raptor algorithm to perform full day range queries and send the results to the repository.
 */
export declare class TransferPatternQuery<T> {
    private readonly raptor;
    private readonly resultFactory;
    private readonly ONE_DAY;
    constructor(raptor: RaptorAlgorithm, resultFactory: TransferPatternResultsFactory<T>);
    /**
     * Generate generate a full day's set of results and store them using the resultsFactory
     */
    plan(origin: StopID, dateObj: Date): T;
}
