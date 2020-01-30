import { RaptorAlgorithm } from "../raptor/RaptorAlgorithm";
import { StopID, Time } from "../gtfs/GTFS";
import { ResultsFactory } from "../results/ResultsFactory";
import { Journey } from "../results/Journey";
/**
 * Implementation of Raptor that searches for journeys departing after a specific time.
 *
 * Only returns results from a single pass of the Raptor algorithm.
 */
export declare class DepartAfterQuery {
    private readonly raptor;
    private readonly resultsFactory;
    private readonly maxSearchDays;
    private readonly groupQuery;
    constructor(raptor: RaptorAlgorithm, resultsFactory: ResultsFactory, maxSearchDays?: number);
    /**
     * Plan a journey between the origin and destination on the given date and time.
     *
     * This method delegates the call to a GroupStationDepartAfterQuery where the origin and
     * destination sets are just a single station.
     *
     * No filters are applied.
     */
    plan(origin: StopID, destination: StopID, date: Date, time: Time): Journey[];
}
