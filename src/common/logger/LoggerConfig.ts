import winston, { format, transports } from "winston";
// import Sentry from "winston-transport-sentry-node";

// const sentryOptions = {
//   sentry: {
//     dsn:
//       process.env.NODE_ENV === "production"
//         ? ""
//         : process.env.NODE_ENV === "staging"
//         ? ""
//         : null,
//   },
//   level: "info",
// };

export class LoggerConfig {
  private readonly options: winston.LoggerOptions;

  constructor() {
    this.options = {
      exitOnError: false,
      format: format.combine(
        format.colorize(),
        format.timestamp(),
        format.printf(
          ({ timestamp, level, context, message, stack, trace }) => {
            return `${timestamp} [${level}] [${context}] - ${message} \n ${
              stack ? stack : ""
            } ${trace ? trace : ""}`;
          }
        )
      ),
      transports: [
        new transports.Console({
          level: process.env.NODE_ENV === "production" ? "warning" : "debug",
        }),
        // ...(process.env.NODE_ENV === 'production' ||
        // process.env.NODE_ENV === 'staging'
        //   ? [new Sentry(sentryOptions)]
        //   : []),
      ], // alert > error > warning > notice > info > debug
    };
  }

  public console(): object {
    return this.options;
  }
}
