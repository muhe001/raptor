"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const gtfs = require("gtfs-stream");
const ts_array_utils_1 = require("ts-array-utils");
const TimeParser_1 = require("./TimeParser");
/**
 * Returns trips, transfers, interchange time and calendars from a GTFS zip.
 */
function loadGTFS(stream) {
    const timeParser = new TimeParser_1.TimeParser();
    const trips = [];
    const transfers = {};
    const interchange = {};
    const calendars = {};
    const dates = {};
    const stopTimes = {};
    const stops = {};
    const routes = {};
    const processor = {
        link: row => {
            const t = {
                origin: row.from_stop_id,
                destination: row.to_stop_id,
                duration: +row.duration,
                startTime: timeParser.getTime(row.start_time),
                endTime: timeParser.getTime(row.end_time)
            };
            ts_array_utils_1.pushNested(t, transfers, row.from_stop_id);
        },
        calendar: row => {
            calendars[row.service_id] = {
                serviceId: row.service_id,
                startDate: +row.start_date,
                endDate: +row.end_date,
                days: {
                    0: row.sunday === "1",
                    1: row.monday === "1",
                    2: row.tuesday === "1",
                    3: row.wednesday === "1",
                    4: row.thursday === "1",
                    5: row.friday === "1",
                    6: row.saturday === "1"
                },
                include: {},
                exclude: {}
            };
        },
        calendar_date: row => {
            ts_array_utils_1.setNested(row.exception_type === "1", dates, row.service_id, row.date);
        },
        trip: row => {
            trips.push({
                routeId: row.route_id,
                serviceId: row.service_id,
                tripId: row.trip_id,
                stopTimes: [],
                service: {}
            });
        },
        stop_time: row => {
            const stopTime = {
                stop: row.stop_id,
                departureTime: timeParser.getTime(row.departure_time),
                arrivalTime: timeParser.getTime(row.arrival_time),
                pickUp: row.pickup_type === "0",
                dropOff: row.drop_off_type === "0"
            };
            ts_array_utils_1.pushNested(stopTime, stopTimes, row.trip_id);
        },
        transfer: row => {
            if (row.from_stop_id === row.to_stop_id) {
                interchange[row.from_stop_id] = +row.min_transfer_time;
            }
            else {
                const t = {
                    origin: row.from_stop_id,
                    destination: row.to_stop_id,
                    duration: +row.min_transfer_time,
                    startTime: 0,
                    endTime: Number.MAX_SAFE_INTEGER
                };
                ts_array_utils_1.pushNested(t, transfers, row.from_stop_id);
            }
        },
        stop: row => {
            const stop = {
                id: row.stop_id,
                code: row.stop_code,
                name: row.stop_name,
                description: row.stop_desc,
                latitude: +row.stop_lat,
                longitude: +row.stop_lon,
                timezone: row.zone_id
            };
            ts_array_utils_1.setNested(stop, stops, row.stop_id);
        },
        route: row => {
            const route = {
                routeId: row.route_id,
                agencyId: row.agency_id,
                routeShortName: row.route_short_name,
                routeLongName: row.route_long_name,
                routeType: row.route_type
            };
            ts_array_utils_1.setNested(route, routes, row.route_id);
        }
    };
    return new Promise(resolve => {
        stream
            .pipe(gtfs({ raw: true }))
            .on("data", entity => processor[entity.type] && processor[entity.type](entity.data))
            .on("end", () => {
            const services = {};
            for (const c of Object.values(calendars)) {
                services[c.serviceId] = {
                    startDate: c.startDate,
                    endDate: c.endDate,
                    days: c.days,
                    dates: dates[c.serviceId],
                };
            }
            for (const t of trips) {
                t.stopTimes = stopTimes[t.tripId];
                t.service = services[t.serviceId];
            }
            resolve([trips, transfers, interchange, stops, routes]);
        });
    });
}
exports.loadGTFS = loadGTFS;
