"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DatabaseLogger = void 0;
const common_1 = require("@nestjs/common");
class DatabaseLogger {
    constructor() {
        this.logger = new common_1.Logger("SQL");
    }
    logQuery(query, parameters) {
        this.logger.debug(`${query} -- Parameters: ${this.stringifyParameters(parameters)}`);
    }
    logQueryError(error, query, parameters) {
        this.logger.error(`${query} -- Parameters: ${this.stringifyParameters(parameters)} -- ${error}`);
    }
    logQuerySlow(time, query, parameters) {
        this.logger.warn(`Time: ${time} -- Parameters: ${this.stringifyParameters(parameters)} -- ${query}`);
    }
    logMigration(message) {
        this.logger.debug(message);
    }
    logSchemaBuild(message) {
        this.logger.debug(message);
    }
    log(level, message) {
        if (level === "log") {
            return this.logger.debug(message);
        }
        if (level === "info") {
            return this.logger.debug(message);
        }
        if (level === "warn") {
            return this.logger.warn(message);
        }
    }
    stringifyParameters(parameters) {
        try {
            return JSON.stringify(parameters);
        }
        catch (_a) {
            return "";
        }
    }
}
exports.DatabaseLogger = DatabaseLogger;
exports.default = DatabaseLogger;
//# sourceMappingURL=DatabaseLogger.js.map