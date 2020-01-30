import { Time, TimetableLeg, Transfer } from "../gtfs/GTFS";
/**
 * A leg
 */
export declare type AnyLeg = Transfer | TimetableLeg;
/**
 * A journey is a collection of legs
 */
export interface Journey {
    legs: AnyLeg[];
    departureTime: Time;
    arrivalTime: Time;
}
