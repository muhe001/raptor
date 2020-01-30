"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const GTFSLoader_1 = require("../src/gtfs/GTFSLoader");
const JourneyFactory_1 = require("../src/results/JourneyFactory");
const fs = require("fs");
const RaptorAlgorithmFactory_1 = require("../src/raptor/RaptorAlgorithmFactory");
const MultipleCriteriaFilter_1 = require("../src/results/filter/MultipleCriteriaFilter");
const GroupStationDepartAfterQuery_1 = require("../src/query/GroupStationDepartAfterQuery");
async function run() {
    console.time("initial load");
    const stream = fs.createReadStream("/home/linus/Downloads/gb-rail-latest.zip");
    const [trips, transfers, interchange] = await GTFSLoader_1.loadGTFS(stream);
    console.timeEnd("initial load");
    console.time("pre-processing");
    const raptor = RaptorAlgorithmFactory_1.RaptorAlgorithmFactory.create(trips, transfers, interchange);
    const query = new GroupStationDepartAfterQuery_1.GroupStationDepartAfterQuery(raptor, new JourneyFactory_1.JourneyFactory(), 3, [new MultipleCriteriaFilter_1.MultipleCriteriaFilter()]);
    console.timeEnd("pre-processing");
    console.time("planning");
    const results = query.plan(["BHM", "BMO", "BSW", "BHI"], ["MCO", "MAN", "MCV", "EXD"], new Date(), 23 * 60 * 60);
    // const results = query.plan("BMH", "YRK", new Date(), 14 * 60 * 60, 18 * 60 * 60);
    console.timeEnd("planning");
    console.log("Results:");
    results.map(journeyToString).forEach(s => console.log(s));
    console.log(`Memory usage: ${Math.round((process.memoryUsage().heapUsed / 1024 / 1024) * 100) / 100} MB`);
}
function journeyToString(j) {
    return toTime(j.departureTime) + ", " +
        toTime(j.arrivalTime) + ", " +
        [j.legs[0].origin, ...j.legs.map(l => l.destination)].join("-");
}
function toTime(time) {
    let hours = Math.floor(time / 3600);
    let minutes = Math.floor((time - (hours * 3600)) / 60);
    let seconds = time - (hours * 3600) - (minutes * 60);
    if (hours < 10) {
        hours = "0" + hours;
    }
    if (minutes < 10) {
        minutes = "0" + minutes;
    }
    if (seconds < 10) {
        seconds = "0" + seconds;
    }
    return hours + ":" + minutes + ":" + seconds;
}
run().catch(e => console.error(e));
