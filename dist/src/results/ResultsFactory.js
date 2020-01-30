"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Type check for a kConnection connection
 */
function isTransfer(connection) {
    return connection.origin !== undefined;
}
exports.isTransfer = isTransfer;
