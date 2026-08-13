/** Shared JSON POST helper for client components calling /api/v1 routes. */
export async function postJson<T>(url: string, body?: unknown): Promise<T> {
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  return (await res.json()) as T;
}
