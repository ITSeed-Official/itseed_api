"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoggerConfig = void 0;
const winston_1 = require("winston");
class LoggerConfig {
    constructor() {
        this.options = {
            exitOnError: false,
            format: winston_1.format.combine(winston_1.format.colorize(), winston_1.format.timestamp(), winston_1.format.printf(({ timestamp, level, context, message, stack, trace }) => {
                return `${timestamp} [${level}] [${context}] - ${message} \n ${stack ? stack : ""} ${trace ? trace : ""}`;
            })),
            transports: [
                new winston_1.transports.Console({
                    level: process.env.NODE_ENV === "production" ? "warning" : "debug",
                }),
            ],
        };
    }
    console() {
        return this.options;
    }
}
exports.LoggerConfig = LoggerConfig;
//# sourceMappingURL=LoggerConfig.js.map