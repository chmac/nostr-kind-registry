import { log } from "../deps.ts";
import { Options } from "../types.ts";

export const createLogger = async (
  options: Pick<Options, "debug" | "verbose" | "silent">
) => {
  const consoleLevel = options.debug
    ? "DEBUG"
    : options.verbose
    ? "ERROR"
    : options.silent
    ? "CRITICAL"
    : "INFO";

  console.log("#yMmDP4 Init logger", consoleLevel);

  await log.setup({
    handlers: {
      console: new log.handlers.ConsoleHandler(consoleLevel, {
        formatter: ({ args, levelName, msg }) => {
          const argsMessage =
            typeof args !== "undefined" &&
            Array.isArray(args) &&
            args.length > 0
              ? ` - ${JSON.stringify(args)}`
              : "";
          const message = `${levelName} ${msg}${argsMessage}`;
          return message;
        },
      }),
    },
    loggers: {
      default: {
        level: consoleLevel,
        handlers: ["console"],
      },
    },
  });

  const logger = log.getLogger();
  return logger;
};
