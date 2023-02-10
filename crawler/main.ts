import { cliffy } from "./deps.ts";
import { crawl } from "./src/crawl.ts";
import { addLogger } from "./src/logger.ts";
import { addDefaultOptionValues } from "./src/options.ts";
import { writeRelayUrl } from "./src/storage.ts";
import { calculateLogLevel } from "./src/utils.ts";

const LogLevelType = new cliffy.EnumType([
  "silent",
  "info",
  "verbose",
  "debug",
]);

const command = new cliffy.Command()
  .name("crawl")
  .description("Crawl nostr relays searching for new kinds")
  .version("0.1.0")
  .globalEnv(
    "DATA_PATH=<dataPath:string>",
    "Set the path to the data repository"
  )
  .globalEnv(
    "DATA_REPO_URL=<dataRepoUrl:string>",
    "The url (including any required authentication) to the data repository",
    { required: true }
  )
  .globalOption("-v, --verbose", "Log every step in the process")
  .globalOption("-d, --debug", "Output debugging logs")
  .globalOption(
    "-s, --silent",
    "Suppress all output (is overridden by --verbose or --debug)"
  )
  .option(
    "-r.i, --relays.inParallel <relayInParallel:integer>",
    "How many relays to crawl",
    {
      default: 1,
    }
  )
  .option(
    "-r.s, --relays.subscriptions <subscriptionCount:integer>",
    "How many subscriptions to make per relay",
    { default: 10 }
  )
  .option(
    "-r.d, --relays.delay <delaySeconds:integer>",
    "How long (in seconds) to wait between each subscription",
    { default: 5 }
  )
  .option(
    "-k.c, --kinds.perSubscription <kindsPerSubscription:integer>",
    "How many kinds to crawl per subscription",
    {
      default: 100,
    }
  )
  .option(
    "-k.m --kinds.maximum <maximum:integer>",
    "The highest kind to check",
    { default: 40e3 }
  )
  .action(async (options) => {
    const logLevel = calculateLogLevel(options);
    const optionsWithLogger = await addLogger(options, logLevel);
    const optionsWithDefaults = addDefaultOptionValues(optionsWithLogger);
    await crawl(optionsWithDefaults);
  })
  .command(
    "add-relay <relayUrl:string>",
    "Add a relay to the list of stored relays"
  )
  .action(async (options, relayUrl) => {
    const logLevel = calculateLogLevel(options);
    const optionsWithLogger = await addLogger(options, logLevel);
    const optionsWithDefaults = addDefaultOptionValues(optionsWithLogger);
    await writeRelayUrl(optionsWithDefaults, relayUrl);
  })
  .type("LogLevel", LogLevelType)
  .env("LOG_LEVEL=<logLevel:LogLevel>", "Set the log level (defaults to info)")
  .env(
    "RELAYS_IN_PARALLEL=<relaysInParallel:int>",
    "How many relays to connect to in parallel"
  )
  .env(
    "RELAYS_SUBSCRIPTIONS=<relaySubscriptions:int>",
    "How many subscriptions to make per relay (before switching relays)"
  )
  .env(
    "RELAYS_DELAY=<relaysDelay:int>",
    "How long to wait between subscriptions (in seconds)"
  )
  .env(
    "KINDS_PER_SUBSCRIPTION=<kindsPerFilter:int>",
    "How many kinds to request per subscription"
  )
  .env(
    "KINDS_MAXIMUM=<kindsMaximum:int>",
    "The maximum kind number to search for (defines the search space)"
  )
  .command(
    "start",
    "Start a crawler and run forever (for docker containers, etc)"
  )
  .action(async (options) => {
    const logLevel = calculateLogLevel(options);
    const optionsWithLogger = await addLogger(options, logLevel);
    const optionsWithDefaults = addDefaultOptionValues(optionsWithLogger);
    // TODO - Implement continuous crawling
  });

try {
  await command.parse();
} catch (error) {
  console.error("#UVxW6D Exiting with error now");
  if (error instanceof Error) {
    console.error(error);
  } else {
    console.error(JSON.stringify(error));
  }
  Deno.exit(1);
}
