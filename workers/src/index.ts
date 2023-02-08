import { IRequest, Router } from "itty-router";
import {
  KindMeta,
  WORKER_OUTPUT_KIND_SINGLE,
  WORKER_OUTPUT_RELAYS,
  WORKER_OUTPUT_RELAY_SINGLE,
  WORKER_OUTPUT_SEEN_KINDS,
} from "../../shared/types";

export interface Env {
  // Learn more at https://developers.cloudflare.com/workers/runtime-apis/kv/
  kinds: KVNamespace;
  relays: KVNamespace;
  AUTH_KEY: string;
}

type KindPut = {
  [kind: number | string]: {
    seen: boolean;
    firstSeenTimestamp?: number;
    seenOnRelays?: string[];
    relatedNips?: number[];
    implementationUrls?: string[];
  };
};

const forbidden = () => Response.json({ error: "Forbidden" }, { status: 403 });

const checkAuth = (request: IRequest, env: Env) => {
  const auth = (request as any).headers.get("authorization");
  if (auth !== env.AUTH_KEY) {
    return forbidden();
  }
};

const randomItem = <T>(input: T[]): T =>
  input[Math.floor(Math.random() * input.length)];

const randomItems = <T>(input: T[], count: number): T[] =>
  Array.from({ length: count }).map(() => randomItem(input));

const router = Router();

router.get(
  "/relays/random",
  async (request, env: Env, context: ExecutionContext) => {
    const listItems = await env.relays.list();
    const countParam =
      typeof request.query.count !== "string"
        ? 1
        : parseInt(request.query.count);
    const count = Math.min(countParam, listItems.keys.length);
    const keys = randomItems(listItems.keys, count);
    const relays = (await Promise.all(
      keys.map((listItem) => env.relays.get(listItem.name, { type: "json" }))
    )) as WORKER_OUTPUT_RELAYS;
    return Response.json(relays);
  }
);

router.post(
  "/relays",
  checkAuth,
  async (request, env: Env, context: ExecutionContext) => {
    const relay = (await request.json()) as WORKER_OUTPUT_RELAY_SINGLE;
    const { url } = relay;
    const existingRelay = await env.relays.get(url);
    if (existingRelay !== null) {
      return Response.json({ error: "exists" }, { status: 400 });
    }
    await env.relays.put(url, JSON.stringify(relay));
    return Response.json({ success: true }, { status: 201 });
  }
);

router.get("/relays", async (request, env: Env, context: ExecutionContext) => {
  const listItems = await env.relays.list();
  const relays = (await Promise.all(
    listItems.keys.map((listItem) =>
      env.relays.get(listItem.name, { type: "json" })
    )
  )) as WORKER_OUTPUT_RELAYS;
  return Response.json(relays);
});

router.post(
  "/kinds",
  checkAuth,
  async (request, env: Env, context: ExecutionContext) => {
    const kindData = (await request.json()) as KindMeta;
    // TODO - Check `kindData` against a schema

    const { kind } = kindData;

    const existingKind = (await env.kinds.get(kind.toString(), {
      type: "json",
    })) as KindMeta | null;

    if (existingKind !== null) {
      return Response.json({ error: "exists" }, { status: 400 });
    }

    await env.kinds.put(kind.toString(), JSON.stringify(kindData));

    return Response.json({ success: true }, { status: 201 });
  }
);

router.get("/kinds", async (request, env: Env, context: ExecutionContext) => {
  const list = await env.kinds.list();
  const kinds = list.keys.map((key) => parseInt(key.name));
  const output: WORKER_OUTPUT_SEEN_KINDS = { kinds };

  return Response.json(output);
});

router.get(
  "/kinds/:kind",
  async (request, env: Env, context: ExecutionContext) => {
    const kind = request.params.kind;
    const kindData = (await env.kinds.get(kind, { type: "json" })) as KindMeta;
    if (kindData === null) {
      return Response.json({ error: "not found" }, { status: 404 });
    }
    const output: WORKER_OUTPUT_KIND_SINGLE = { kind: kindData };

    return Response.json(output);
  }
);

router.all("*", () => Response.json({ error: "not found" }, { status: 404 }));

addEventListener("fetch", (event) =>
  event.respondWith(router.handle(event.request))
);

export default {
  async fetch(
    request: Request,
    env: Env,
    context: ExecutionContext
  ): Promise<Response> {
    return router.handle(request, env, context);
  },
};
