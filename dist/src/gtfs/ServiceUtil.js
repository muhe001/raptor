"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ServiceUtil {
    static runsOn(service, date, dow) {
        return service.dates[date] || (!service.dates.hasOwnProperty(date) &&
            service.startDate <= date &&
            service.endDate >= date &&
            service.days[dow]);
    }
}
exports.ServiceUtil = ServiceUtil;
