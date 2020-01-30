import { Journey } from "../Journey";
import { JourneyFilter } from "./JourneyFilter";
/**
 * Returns true if b arrives before or at the same time as a
 */
export declare const earliestArrival: (a: any, b: any) => boolean;
/**
 * Returns true if b has the same or fewer changes than a
 */
export declare const leastChanges: (a: any, b: any) => boolean;
/**
 * Filters journeys based on a number of configurable criteria
 */
export declare class MultipleCriteriaFilter implements JourneyFilter {
    private readonly criteria;
    constructor(criteria?: FilterCriteria[]);
    /**
     * Sort the journeys and then apply the criteria
     */
    apply(journeys: Journey[]): Journey[];
    /**
     * Sort by departure time ascending and arrival time descending as a tie breaker
     */
    private sort;
    /**
     * Keeps the journey as long as there is no subsequent journey that is better in every regard.
     */
    private compare;
}
/**
 * Function that compares two journeys and returns true if the second is better than the first
 */
export declare type FilterCriteria = (a: Journey, b: Journey) => boolean;
