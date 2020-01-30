"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cp = require("child_process");
const ProgressBar = require("progress");
const GTFSLoader_1 = require("./gtfs/GTFSLoader");
const fs = require("fs");
const numCPUs = require("os").cpus().length;
async function run(filename) {
    const date = new Date();
    const stream = fs.createReadStream(filename);
    const [trips, transfers, interchange, stopIndex] = await GTFSLoader_1.loadGTFS(stream);
    const stops = Object.keys(stopIndex);
    const bar = new ProgressBar("  [:current of :total] [:bar] :percent eta :eta  ", { total: stops.length });
    for (let i = 0; i < Math.min(numCPUs - 1, stops.length); i++) {
        const worker = cp.fork(__dirname + "/transfer-pattern-worker", [filename, date.toISOString()]);
        worker.on("message", () => {
            if (stops.length > 0) {
                bar.tick();
                worker.send(stops.pop());
            }
            else {
                worker.kill("SIGUSR2");
            }
        });
    }
}
if (process.argv[2]) {
    run(process.argv[2]).catch(e => console.error(e));
}
else {
    console.log("Please specify a GTFS file.");
}
