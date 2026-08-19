import "server-only";
import { NextResponse } from "next/server";
import { getApiSession } from "@/lib/auth/dal";
import { isSuperadmin } from "@/lib/auth/roles";
import type { ApiResult } from "@/lib/api/types";

export { isAdmin, isStaff, isSuperadmin } from "@/lib/auth/roles";

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

export function forbidden() {
  return NextResponse.json<ApiResult>({ error: "Akses ditolak." }, { status: 403 });
}

export function requireSuperadmin(role: string) {
  if (!isSuperadmin(role)) {
    return forbidden();
  }
  return null;
}
