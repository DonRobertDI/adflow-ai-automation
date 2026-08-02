interface JsonResponseOptions {
  status?: number;
  requestId?: string;
}

export function jsonResponse(body: unknown, options: JsonResponseOptions = {}): Response {
  const headers = new Headers({
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store, max-age=0',
    Pragma: 'no-cache',
    'X-Content-Type-Options': 'nosniff',
  });
  if (options.requestId) headers.set('x-request-id', options.requestId);
  return new Response(JSON.stringify(body), { status: options.status ?? 200, headers });
}
