"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Convert a Date object into a numeric representation e.g. 20190417
 */
function getDateNumber(date) {
    const str = date.toISOString();
    return parseInt(str.slice(0, 4) + str.slice(5, 7) + str.slice(8, 10), 10);
}
exports.getDateNumber = getDateNumber;
