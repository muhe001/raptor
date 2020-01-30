"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.allDays = { 0: true, 1: true, 2: true, 3: true, 4: true, 5: true, 6: true };
exports.services = {
    "1": {
        startDate: 20180101,
        endDate: 20991231,
        days: exports.allDays,
        dates: {}
    },
    "2": {
        startDate: 20190101,
        endDate: 20991231,
        days: exports.allDays,
        dates: {}
    }
};
let tripId = 0;
function t(...stopTimes) {
    return {
        tripId: "trip" + tripId++,
        stopTimes: stopTimes,
        serviceId: "1",
        service: exports.services["1"]
    };
}
exports.t = t;
function st(stop, arrivalTime, departureTime) {
    return {
        stop: stop,
        arrivalTime: arrivalTime || departureTime,
        departureTime: departureTime || arrivalTime,
        dropOff: arrivalTime !== null,
        pickUp: departureTime !== null
    };
}
exports.st = st;
const defaultTrip = { tripId: "1", serviceId: "1", stopTimes: [], service: exports.services["1"] };
function j(...legStopTimes) {
    return {
        departureTime: getDepartureTime(legStopTimes),
        arrivalTime: getArrivalTime(legStopTimes),
        legs: legStopTimes.map(stopTimes => isTransfer(stopTimes) ? stopTimes : ({
            stopTimes,
            origin: stopTimes[0].stop,
            destination: stopTimes[stopTimes.length - 1].stop,
            trip: defaultTrip
        }))
    };
}
exports.j = j;
function getDepartureTime(legs) {
    let transferDuration = 0;
    for (const leg of legs) {
        if (isTransfer(leg)) {
            transferDuration += leg.duration;
        }
        else {
            return leg[0].departureTime - transferDuration;
        }
    }
    return 0;
}
function getArrivalTime(legs) {
    let transferDuration = 0;
    for (let i = legs.length - 1; i >= 0; i--) {
        const leg = legs[i];
        if (isTransfer(leg)) {
            transferDuration += leg.duration;
        }
        else {
            return leg[leg.length - 1].arrivalTime + transferDuration;
        }
    }
    return 0;
}
function isTransfer(connection) {
    return connection.origin !== undefined;
}
exports.isTransfer = isTransfer;
function tf(origin, destination, duration) {
    return { origin, destination, duration, startTime: 0, endTime: Number.MAX_SAFE_INTEGER };
}
exports.tf = tf;
function setDefaultTrip(results) {
    for (const trip of results) {
        for (const leg of trip.legs) {
            if (leg.trip) {
                leg.trip = defaultTrip;
            }
        }
    }
}
exports.setDefaultTrip = setDefaultTrip;
