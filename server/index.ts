const port = Number(Bun.env.PORT ?? 8787);

async function proxyRequest(target: string, req: Request): Promise<Response> {
  const headers = new Headers();
  const contentType = req.headers.get("Content-Type");
  if (contentType) {
    headers.set("Content-Type", contentType);
  }

  try {
    const body = req.method !== "GET" && req.method !== "HEAD"
      ? await req.arrayBuffer()
      : undefined;

    const upstream = await fetch(target, {
      method: req.method,
      headers,
      body,
    });

    const data = await upstream.arrayBuffer();

    return new Response(data, {
      status: upstream.status,
      headers: {
        "Content-Type": upstream.headers.get("Content-Type") ?? "application/octet-stream",
        "Access-Control-Allow-Origin": "*",
      },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error(`Proxy error for ${target}:`, message);
    return new Response(
      JSON.stringify({ error: "proxy_error", message }),
      { status: 502, headers: { "Content-Type": "application/json" } },
    );
  }
}

const server = Bun.serve({
  port,
  async fetch(req) {
    const url = new URL(req.url);

    if (req.method === "GET" && url.pathname === "/api/health") {
      return new Response(JSON.stringify({ status: "ok" }), {
        headers: { "Content-Type": "application/json" },
      });
    }

    if (url.pathname.startsWith("/api/")) {
      const apiPath = url.pathname.replace("/api", "") + url.search;
      const target = `https://api-hackathon.codedematrixtech.com${apiPath}`;
      return proxyRequest(target, req);
    }

    return new Response("Not found", { status: 404 });
  },
});

console.log(`Server listening on http://localhost:${server.port}`);
