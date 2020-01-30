import { RaptorAlgorithm } from "../raptor/RaptorAlgorithm";
import { ResultsFactory } from "../results/ResultsFactory";
import { StopID } from "../gtfs/GTFS";
import { Journey } from "../results/Journey";
import { JourneyFilter } from "../results/filter/JourneyFilter";
/**
 * Use the Raptor algorithm to generate a full day of results.
 */
export declare class RangeQuery {
    private readonly raptor;
    private readonly resultsFactory;
    private readonly maxSearchDays;
    private readonly filters;
    private readonly ONE_DAY;
    private readonly groupQuery;
    constructor(raptor: RaptorAlgorithm, resultsFactory: ResultsFactory, maxSearchDays?: number, filters?: JourneyFilter[]);
    /**
     * Perform a query at midnight, and then continue to search one minute after the earliest departure of each set of
     * results.
     */
    plan(origin: StopID, destination: StopID, date: Date, time?: number, endTime?: number): Journey[];
}
