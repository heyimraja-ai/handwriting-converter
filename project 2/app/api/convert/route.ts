export async function GET() {
  const hasEnv = !!process.env.N8N_WEBHOOK_URL;
  return new Response(
    `convert route up | env:${hasEnv ? "ok" : "missing"}`,
    { headers: { "Content-Type": "text/plain; charset=utf-8" } }
  );
}



export async function POST(req: Request) {
  if (!process.env.N8N_WEBHOOK_URL) {
    return new Response("Error: N8N_WEBHOOK_URL environment variable is not configured", {
      status: 500,
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  }

  const form = await req.formData(); // get the uploaded file + fields
  const res = await fetch(process.env.N8N_WEBHOOK_URL!, {
    method: "POST",
    body: form, // forward as multipart/form-data
    // important: DO NOT set Content-Type; fetch will set the boundary
  });
  const text = await res.text();
  return new Response(text, {
    status: res.ok ? 200 : res.status,
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
