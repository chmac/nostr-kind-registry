/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `wrangler dev src/index.ts` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `wrangler publish src/index.ts --name my-worker` to publish your worker
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */

const KEY_TMP = "__tmp" as const;
const AUTH = "1234";

export interface Env {
  // Learn more at https://developers.cloudflare.com/workers/runtime-apis/kv/
  kinds: KVNamespace;
}

const outputJson = (output: any) =>
  new Response(JSON.stringify(output), {
    headers: {
      "content-type": "application/json;charset=UTF-8",
    },
  });

export default {
  async fetch(
    request: Request,
    env: Env,
    ctx: ExecutionContext
  ): Promise<Response> {
    const parsedUrl = new URL(request.url);
    const { pathname } = parsedUrl;
    if (pathname === "/" && request.method === "GET") {
      return outputJson({ method: "get", kinds: [0, 1, 2] });
    }

    if (request.method === "PUT") {
      const auth = request.headers.get("authentication");
      if (auth !== AUTH) {
        return new Response("", { status: 403 });
      }
      return outputJson({ method: request.method, auth });
    }

    await env.kinds.put(KEY_TMP, "success");
    const list = await env.kinds.list();
    return new Response(JSON.stringify(list));
  },
};
