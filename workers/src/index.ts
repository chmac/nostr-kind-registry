const AUTH = "1234";

export interface Env {
  // Learn more at https://developers.cloudflare.com/workers/runtime-apis/kv/
  kinds: KVNamespace;
  relays: KVNamespace;
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

export default {
  async fetch(
    request: Request,
    env: Env,
    ctx: ExecutionContext
  ): Promise<Response> {
    const parsedUrl = new URL(request.url);
    const { pathname } = parsedUrl;
    const kind = pathname.substring(1);

    if (pathname.startsWith("/relays")) {
      if (request.method !== "GET") {
        return forbidden();
      }
      const relayLists = await env.relays.list();
      const relays = <string[]>[];
      for (const relayList of relayLists.keys) {
        const relay = await env.relays.get(relayList.name);
        relays.push(relay!);
      }
      return Response.json(relays);
    }

    if (request.method === "PUT") {
      if (pathname === "/") {
        return forbidden();
      }

      const kindInt = parseInt(kind);
      // TODO - The kind to path mapping could be better verified here
      if (!Number.isInteger(kindInt) || kindInt.toString() !== kind) {
        return Response.json(
          { error: "Invalid", code: "#0LA0q2" },
          { status: 400 }
        );
      }

      const auth = request.headers.get("authentication");
      if (auth !== AUTH) {
        return forbidden();
      }

      const kindData = (await request.json()) as KindPut;
      // TODO - Check `kindData` against a schema

      await env.kinds.put(kind.toString(), JSON.stringify(kindData));

      return Response.json({ success: true });
    }

    if (pathname === "/" && request.method === "GET") {
      const list = await env.kinds.list();
      const kinds = list.keys.map((key) => key.name);

      return Response.json({ kinds });
    }

    if (request.method !== "GET") {
      return forbidden();
    }

    const kindData = await env.kinds.get(kind);
    if (kindData === null) {
      return Response.json({ error: "Not found" }, { status: 404 });
    }
    return Response.json(kindData);
  },
};
