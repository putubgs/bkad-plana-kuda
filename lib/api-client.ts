/** Shared JSON helpers for client components calling /api/v1 routes. */
export async function getJson<T>(url: string): Promise<T> {
  const res = await fetch(url);
  return (await res.json()) as T;
}

export async function postJson<T>(url: string, body?: unknown): Promise<T> {
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  return (await res.json()) as T;
}

export async function patchJson<T>(url: string, body?: unknown): Promise<T> {
  const res = await fetch(url, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  return (await res.json()) as T;
}

export async function deleteJson<T>(url: string): Promise<T> {
  const res = await fetch(url, { method: "DELETE" });
  return (await res.json()) as T;
}
