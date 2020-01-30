"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const DateUtil_1 = require("./DateUtil");
/**
 * Uses the Raptor algorithm to perform full day range queries and send the results to the repository.
 */
class TransferPatternQuery {
    constructor(raptor, resultFactory) {
        this.raptor = raptor;
        this.resultFactory = resultFactory;
        this.ONE_DAY = 24 * 60 * 60;
    }
    /**
     * Generate generate a full day's set of results and store them using the resultsFactory
     */
    plan(origin, dateObj) {
        const date = DateUtil_1.getDateNumber(dateObj);
        const dayOfWeek = dateObj.getDay();
        const results = this.resultFactory();
        let time = 1;
        while (time < this.ONE_DAY) {
            const [kConnections] = this.raptor.scan({ [origin]: time }, date, dayOfWeek);
            results.add(kConnections);
            time += 5 * 60; // todo get earliest departure at the origin
        }
        return results.finalize();
    }
}
exports.TransferPatternQuery = TransferPatternQuery;
