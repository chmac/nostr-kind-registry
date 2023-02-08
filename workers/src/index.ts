import { MiddlewareHandler, Hono } from "hono";
import { cors } from "hono/cors";
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

const checkAuth: MiddlewareHandler = async (c, next) => {
  const auth = c.req.headers.get("authorization");
  if (auth !== c.env.AUTH_KEY) {
    return forbidden();
  }
  await next();
};

const randomItem = <T>(input: T[]): T =>
  input[Math.floor(Math.random() * input.length)];

const randomItems = <T>(input: T[], count: number): T[] =>
  Array.from({ length: count }).map(() => randomItem(input));

const app = new Hono<{ Bindings: Env }>();
app.use("*", cors());

app.get(
  "/relays/random",
  // async (request, env: Env, context: ExecutionContext) => {
  async (context) => {
    const { env } = context;
    const { countParamString } = context.req.query();
    const countParam = parseInt(countParamString);
    const listItems = await env.relays.list();
    const count = Math.min(countParam, listItems.keys.length);
    const keys = randomItems(listItems.keys, count);
    const relays = (await Promise.all(
      keys.map((listItem) => env.relays.get(listItem.name, { type: "json" }))
    )) as WORKER_OUTPUT_RELAYS;
    return context.json(relays);
  }
);

app.post("/relays", checkAuth, async (context) => {
  const { env } = context;
  const maybeRelay = await context.req.json();

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
});

app.get("/relays", async (context) => {
  const { env } = context;
  const listItems = await env.relays.list();
  const relays = (await Promise.all(
    listItems.keys.map((listItem) =>
      env.relays.get(listItem.name, { type: "json" })
    )
  )) as WORKER_OUTPUT_RELAYS;
  return Response.json(relays);
});

app.post("/kinds", checkAuth, async (context) => {
  const { env } = context;
  const maybeKindData = await context.req.json();

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
});

app.get("/kinds", async (context) => {
  const { env } = context;
  const list = await env.kinds.list();
  const kinds = list.keys.map((key) => parseInt(key.name));
  const output: WORKER_OUTPUT_SEEN_KINDS = { kinds };

  return Response.json(output);
});

app.get("/kinds/:kind", async (context) => {
  const { env } = context;

  const kind = context.req.param("kind");
  const kindData = (await env.kinds.get(kind, { type: "json" })) as KindMeta;
  if (kindData === null) {
    return Response.json({ error: "not found" }, { status: 404 });
  }
  const output: WORKER_OUTPUT_KIND_SINGLE = { kind: kindData };

  return Response.json(output);
});

// app.all("*", () => Response.json({ error: "not found" }, { status: 404 }));
app.notFound(async (context) => {
  return context.json({ error: "not found" }, 404);
});

export default app;
