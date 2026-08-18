// Serves the server's own clock so the client can correct for a wrong or
// drifted system clock — the server's time is NTP-synced, the visitor's isn't
// guaranteed to be.

export async function GET() {
  return Response.json(
    { time: new Date().toISOString() },
    { headers: { "Cache-Control": "no-store" } },
  );
}
