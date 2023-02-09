import { log } from "../deps.ts";
import { Options } from "../types.ts";

const calculateConsoleLevel = (
  options: Pick<Options, "debug" | "verbose" | "silent">
) => {
  if (options.debug) {
    return "DEBUG";
  }
  if (options.verbose) {
    return "ERROR";
  }
  if (options.silent) {
    return "CRITICAL";
  }
  return "INFO";
};

export const createLogger = async (
  options: Pick<Options, "debug" | "verbose" | "silent">
) => {
  const consoleLevel = calculateConsoleLevel(options);

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
