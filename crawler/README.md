# Crawler

A deno based crawler.

It selects a random set of relays, then a random set of as yet unseen kinds, and
queries the relays for those kinds. With a delay between subscriptions to be
gentler on the relays. The settings are all configurable from the command line.

It can be compiled into a single binary with `deno task compiled`.
