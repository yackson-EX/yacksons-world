export const prerender = false;

const MAX_SIZE_BYTES = 5 * 1024 * 1024; // 5MB guardrail for PNGs

type Body = { imageDataUrl?: string };

const badRequest = (message: string, status = 400) =>
  new Response(JSON.stringify({ error: message }), {
    status,
    headers: { "content-type": "application/json" },
  });

export async function POST({ request }: { request: Request }) {
  if (request.headers.get("content-type")?.includes("application/json") !== true) {
    return badRequest("Expected application/json");
  }

  let body: Body;
  try {
    body = (await request.json()) as Body;
  } catch (error) {
    return badRequest("Invalid JSON");
  }

  const dataUrl = body.imageDataUrl;
  if (!dataUrl || typeof dataUrl !== "string" || !dataUrl.startsWith("data:image/png;base64,")) {
    return badRequest("Missing PNG data");
  }

  const base64 = dataUrl.split(",")[1] ?? "";
  const buffer = Buffer.from(base64, "base64");
  if (!buffer.length || buffer.length > MAX_SIZE_BYTES) {
    return badRequest("File too large", 413);
  }

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.DRAWING_SEND_TO;
  const from = process.env.DRAWING_SEND_FROM ?? "drawings@yacksons.world";
  const subject = process.env.DRAWING_SEND_SUBJECT ?? "New drawing for Yackson";

  if (!apiKey || !to) {
    return badRequest("Email not configured on server", 500);
  }

  const attachments = [
    {
      filename: "yackson-drawing.png",
      content: base64,
      type: "image/png",
    },
  ];

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to,
      subject,
      text: "New drawing attached.",
      attachments,
    }),
  });

  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    return badRequest(`Send failed: ${res.status} ${detail || ""}`, 502);
  }

  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: { "content-type": "application/json" },
  });
}
