import { IRequest, Router } from "itty-router";
import {
  KindMeta,
  WORKER_OUTPUT_KIND_SINGLE,
  WORKER_OUTPUT_RELAYS,
  WORKER_OUTPUT_SEEN_KINDS,
} from "../../shared/types";
import { KindMetaSchema, RelaySchema } from "./schemas";

export interface Env {
  // Learn more at https://developers.cloudflare.com/workers/runtime-apis/kv/
  kinds: KVNamespace;
  relays: KVNamespace;
  AUTH_KEY: string;
}

const forbidden = () => Response.json({ error: "Forbidden" }, { status: 403 });

const checkAuth = (request: IRequest, env: Env) => {
  const auth = (request as any).headers.get("authorization");
  if (auth !== env.AUTH_KEY) {
    console.log("#l9u3Uw env.AUTH_KEY", env.AUTH_KEY);
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
    const maybeRelay = await request.json();

    const parseResult = RelaySchema.safeParse(maybeRelay);
    if (!parseResult.success) {
      return Response.json(
        { error: "invalid", code: "#jlbfq4" },
        { status: 400 }
      );
    }

    const relay = parseResult.data;
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
    const maybeKindData = await request.json();

    const parseResult = KindMetaSchema.safeParse(maybeKindData);

    if (!parseResult.success) {
      return Response.json(
        { error: "invalid", code: "#4fhAeE" },
        { status: 400 }
      );
    }

    const kindData = parseResult.data;
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

export default {
  async fetch(
    request: Request,
    env: Env,
    context: ExecutionContext
  ): Promise<Response> {
    return router.handle(request, env, context);
  },
};
