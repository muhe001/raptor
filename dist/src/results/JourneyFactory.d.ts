import { StopID } from "../gtfs/GTFS";
import { ResultsFactory } from "./ResultsFactory";
import { ConnectionIndex } from "../raptor/ScanResults";
import { Journey } from "./Journey";
/**
 * Extracts journeys from the kConnections index.
 */
export declare class JourneyFactory implements ResultsFactory {
    /**
     * Take the best result of each round for the given destination and turn it into a journey.
     */
    getResults(kConnections: ConnectionIndex, destination: StopID): Journey[];
    /**
     * Iterate back through each connection and build up a series of legs to plan the journey
     */
    private getJourneyLegs;
    private getDepartureTime;
    private getArrivalTime;
    private isTimetableLeg;
}
