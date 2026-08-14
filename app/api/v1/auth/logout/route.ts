import { NextRequest, NextResponse } from "next/server";
import { destroySession } from "@/lib/auth/session";
import { isSameOrigin } from "@/lib/auth/verify-origin";
import type { ApiResult } from "@/lib/api/types";

export async function POST(request: NextRequest) {
  if (!isSameOrigin(request)) {
    return NextResponse.json<ApiResult>({ error: "Permintaan tidak valid." }, { status: 403 });
  }

  await destroySession();

  return NextResponse.json<ApiResult>({ redirectTo: "/login" });
}
