import "server-only";
import { headers } from "next/headers";

export async function getRequestMeta() {
  const headerList = await headers();
  const forwardedFor = headerList.get("x-forwarded-for");
  const ipAddress = forwardedFor ? forwardedFor.split(",")[0]?.trim() : headerList.get("x-real-ip");
  const userAgent = headerList.get("user-agent");

  return {
    ipAddress: ipAddress ?? null,
    userAgent: userAgent ?? null,
  };
}
