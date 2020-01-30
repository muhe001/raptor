import { Service, DateNumber, DayOfWeek } from "./GTFS";

export class ServiceUtil {
    static runsOn(service: Service, date: number, dow: DayOfWeek): boolean {
        return service.dates[date] || (
            !service.dates.hasOwnProperty(date) &&
            service.startDate <= date &&
            service.endDate >= date &&
            service.days[dow]
        );
    }
}