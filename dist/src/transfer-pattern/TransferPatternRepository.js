"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Access to the transfer_patterns table in a mysql compatible database
 */
class TransferPatternRepository {
    constructor(db) {
        this.db = db;
    }
    /**
     * Store every transfer pattern in the tree
     */
    async storeTransferPatterns(patterns) {
        const journeys = [];
        for (const journey in patterns) {
            for (const pattern of patterns[journey]) {
                journeys.push([journey, pattern]);
            }
        }
        if (journeys.length > 0) {
            try {
                await this.db.query("INSERT IGNORE INTO transfer_patterns VALUES ?", [journeys]);
            }
            catch (err) {
                console.error(err);
            }
        }
    }
    /**
     * Create the transfer pattern table if it does not already exist
     */
    async initTables() {
        await this.db.query(`
      CREATE TABLE transfer_patterns (
        journey char(6) NOT NULL,
        pattern varchar(255) NOT NULL,
        PRIMARY KEY (journey,pattern)
      ) ENGINE=InnoDB DEFAULT CHARSET=latin1
     `);
    }
}
exports.TransferPatternRepository = TransferPatternRepository;
