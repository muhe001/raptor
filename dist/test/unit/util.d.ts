import { StopID, StopTime, Time, Transfer, Trip } from "../../src/gtfs/GTFS";
import { Journey } from "../../src/results/Journey";
export declare const allDays: {
    0: boolean;
    1: boolean;
    2: boolean;
    3: boolean;
    4: boolean;
    5: boolean;
    6: boolean;
};
export declare const services: {
    "1": {
        startDate: number;
        endDate: number;
        days: {
            0: boolean;
            1: boolean;
            2: boolean;
            3: boolean;
            4: boolean;
            5: boolean;
            6: boolean;
        };
        dates: {};
    };
    "2": {
        startDate: number;
        endDate: number;
        days: {
            0: boolean;
            1: boolean;
            2: boolean;
            3: boolean;
            4: boolean;
            5: boolean;
            6: boolean;
        };
        dates: {};
    };
};
export declare function t(...stopTimes: StopTime[]): Trip;
export declare function st(stop: StopID, arrivalTime: Time | null, departureTime: Time | null): StopTime;
export declare function j(...legStopTimes: (StopTime[] | Transfer)[]): Journey;
export declare function isTransfer(connection: StopTime[] | Transfer): connection is Transfer;
export declare function tf(origin: StopID, destination: StopID, duration: Time): Transfer;
export declare function setDefaultTrip(results: Journey[]): void;
