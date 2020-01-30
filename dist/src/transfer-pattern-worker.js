"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const GTFSLoader_1 = require("./gtfs/GTFSLoader");
const StringResults_1 = require("./transfer-pattern/results/StringResults");
const TransferPatternRepository_1 = require("./transfer-pattern/TransferPatternRepository");
const fs = require("fs");
const RaptorAlgorithmFactory_1 = require("./raptor/RaptorAlgorithmFactory");
const TransferPatternQuery_1 = require("./query/TransferPatternQuery");
/**
 * Worker that finds transfer patterns for a given station
 */
async function worker(filename, date) {
    const stream = fs.createReadStream(filename);
    const [trips, transfers, interchange] = await GTFSLoader_1.loadGTFS(stream);
    const raptor = RaptorAlgorithmFactory_1.RaptorAlgorithmFactory.create(trips, transfers, interchange, date);
    const query = new TransferPatternQuery_1.TransferPatternQuery(raptor, () => new StringResults_1.StringResults());
    const repository = new TransferPatternRepository_1.TransferPatternRepository(getDatabase());
    process.on("message", stop => {
        const results = query.plan(stop, date);
        repository.storeTransferPatterns(results);
        morePlease();
    });
    process.on("SIGUSR2", () => {
        process.exit();
    });
    morePlease();
}
function morePlease() {
    process.send("ready");
}
function getDatabase() {
    return require("mysql2/promise").createPool({
        host: process.env.DATABASE_HOSTNAME || "localhost",
        user: process.env.DATABASE_USERNAME || "root",
        password: process.env.DATABASE_PASSWORD || "",
        database: process.env.OJP_DATABASE_NAME || "raptor",
        connectionLimit: 5,
    });
}
if (process.argv[2] && process.argv[3]) {
    worker(process.argv[2], new Date(process.argv[3])).catch(err => {
        console.error(err);
        process.exit();
    });
}
else {
    console.log("Please specify a date and GTFS file.");
}
