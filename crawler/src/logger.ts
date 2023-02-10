import { log } from "../deps.ts";

export const addLogger = async <T>(
  options: T,
  logLevel: log.LevelName
): Promise<T & { logger: log.Logger }> => {
  await log.setup({
    handlers: {
      console: new log.handlers.ConsoleHandler(logLevel, {
        formatter: ({ args, levelName, msg }) => {
          const argsMessage =
            typeof args !== "undefined" &&
            Array.isArray(args) &&
            args.length > 0
              ? ` - ${Deno.inspect(args)}`
              : "";
          const message = `${levelName} ${msg}${argsMessage}`;
          return message;
        },
      }),
    },
    loggers: {
      default: {
        level: logLevel,
        handlers: ["console"],
      },
    },
  });

  const logger = log.getLogger();
  return { ...options, logger };
};
