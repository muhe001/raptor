import { Service, DayOfWeek } from "./GTFS";
export declare class ServiceUtil {
    static runsOn(service: Service, date: number, dow: DayOfWeek): boolean;
}
