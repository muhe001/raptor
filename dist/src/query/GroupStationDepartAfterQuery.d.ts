import { RaptorAlgorithm } from "../raptor/RaptorAlgorithm";
import { StopID, Time } from "../gtfs/GTFS";
import { ResultsFactory } from "../results/ResultsFactory";
import { Journey } from "../results/Journey";
import { JourneyFilter } from "../results/filter/JourneyFilter";
/**
 * Implementation of Raptor that searches for journeys between a set of origin and destinations.
 *
 * Only returns results from a single pass of the Raptor algorithm.
 */
export declare class GroupStationDepartAfterQuery {
    private readonly raptor;
    private readonly resultsFactory;
    private readonly maxSearchDays;
    private readonly filters;
    constructor(raptor: RaptorAlgorithm, resultsFactory: ResultsFactory, maxSearchDays?: number, filters?: JourneyFilter[]);
    /**
     * Plan a journey between the origin and destination set of stops on the given date and time
     */
    plan(origins: StopID[], destinations: StopID[], date: Date, time: Time): Journey[];
    /**
     * Find journeys using the raptor object, if no results are found then increment the day and keep
     * searching until results have been found or the maximum number of days has been reached
     */
    private getJourneys;
    /**
     * Take all the stops we've visited and set the departure time for the next day as the best arrival time at that
     * stop minus 1 day. This prevents invalid departures where the arrival time at a stop is greater than 24 hours
     * e.g. arriving at 28:30 but departing at 04:00 the next day.
     */
    private getFoundStations;
    /**
     * Create journeys that may span multiple days by stitching together multiple kConnection results
     * into individual journeys.
     */
    private getJourneysFromConnections;
    /**
     * Reducer that takes the current list of journeys and prepends results based on the given kConnections
     */
    private completeJourneys;
    /**
     * Add journey B to the end of journey A and correct the arrival / departure times
     */
    private mergeJourneys;
}
