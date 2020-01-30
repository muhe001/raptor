/**
 * StopID e.g. NRW
 */
export declare type StopID = string;
/**
 * Time in seconds since midnight (note this may be greater than 24 hours).
 */
export declare type Time = number;
/**
 * Duration in seconds
 */
export declare type Duration = number;
/**
 * GTFS stop time
 */
export interface StopTime {
    stop: StopID;
    arrivalTime: Time;
    departureTime: Time;
    pickUp: boolean;
    dropOff: boolean;
}
/**
 * Leg of a journey
 */
export interface Leg {
    origin: StopID;
    destination: StopID;
}
/**
 * Leg with a defined departure and arrival time
 */
export interface TimetableLeg extends Leg {
    stopTimes: StopTime[];
    trip: Trip;
}
/**
 * Leg with a duration instead of departure and arrival time
 */
export interface Transfer extends Leg {
    duration: Duration;
    startTime: Time;
    endTime: Time;
}
/**
 * GTFS trip_id
 */
export declare type TripID = string;
/**
 * GTFS service_id, used to determine the trip's calendar
 */
export declare type ServiceID = string;
/**
 * GTFS trip
 */
export interface Trip {
    tripId: TripID;
    stopTimes: StopTime[];
    serviceId: ServiceID;
    service: Service;
}
/**
 * Date stored as a number, e.g 20181225
 */
export declare type DateNumber = number;
/**
 * Index of dates, used to access exclude/include dates in O(1) time
 */
export declare type DateIndex = Record<DateNumber, boolean>;
/**
 * Sunday = 0, Monday = 1... don't blame me, blame JavaScript .getDay
 */
export declare type DayOfWeek = 0 | 1 | 2 | 3 | 4 | 5 | 6;
/**
 * GTFS calendar
 */
export interface Calendar {
    serviceId: ServiceID;
    startDate: DateNumber;
    endDate: DateNumber;
    days: Record<DayOfWeek, boolean>;
    exclude: DateIndex;
    include: DateIndex;
}
/**
 * Calendars indexed by service ID
 */
export declare type CalendarIndex = Record<ServiceID, Calendar>;
/**
 * GTFS stop
 */
export interface Stop {
    id: StopID;
    code: string;
    name: string;
    description: string;
    latitude: number;
    longitude: number;
    timezone: string;
}
/**
 * Stops indexed by ID
 */
export declare type StopIndex = Record<StopID, Stop>;
/**
 * GTFS service
 */
export interface Service {
    startDate: DateNumber;
    endDate: DateNumber;
    days: Record<DayOfWeek, boolean>;
    dates: DateIndex;
}
