import { WORKER_URL } from "../shared/constants.ts";
import { KindMeta } from "../shared/types.ts";
import { cliffy } from "./deps.ts";
import { createLogger } from "./src/logger.ts";
import {
  getKindMeta,
  getKinds,
  writeKindMeta,
  writeRelayUrl,
} from "./src/storage.ts";
import { crawl } from "./src/crawl.ts";

const command = new cliffy.Command()
  .name("crawl")
  .description("Crawl nostr relays searching for new kinds")
  .version("0.1.0")
  .globalEnv(
    "DATA_PATH=<dataPath:string>",
    "Set the path to the data repository",
    {
      required: true,
    }
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
    "-r.c, --relays.count <relayCount:integer>",
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
    const logger = await createLogger(options);
    await crawl({ ...options, logger });
  })
  .command(
    "add-relay <relayUrl:string>",
    "Add a relay to the list of stored relays"
  )
  .action(async (options, relayUrl) => {
    const logger = await createLogger(options);
    await writeRelayUrl({ ...options, logger }, relayUrl);
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
