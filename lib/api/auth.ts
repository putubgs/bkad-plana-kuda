import "server-only";
import { NextResponse } from "next/server";
import { getApiSession } from "@/lib/auth/dal";
import type { ApiResult } from "@/lib/api/types";

export async function requireApiSession() {
  const session = await getApiSession();
  if (!session) {
    return {
      session: null,
      response: NextResponse.json<ApiResult>(
        { error: "Sesi tidak valid. Silakan login kembali." },
        { status: 401 }
      ),
    };
  }

  return { session, response: null };
}

export function isSuperadmin(role: string) {
  return role.toLowerCase() === "superadmin";
}
