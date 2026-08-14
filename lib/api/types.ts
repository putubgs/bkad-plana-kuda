/** Shared JSON envelope returned by every /api/v1/auth and /api/v1/mfa route. */
export interface ApiResult {
  error?: string;
  fieldErrors?: Record<string, string[] | undefined>;
  mfaRequired?: boolean;
  success?: string;
  /** Set instead of calling redirect() server-side; the client does router.push(redirectTo). */
  redirectTo?: string;
  /** mfa/setup/verify and mfa/recovery-codes/regenerate only. */
  recoveryCodes?: string[];
  /** mfa/setup/start only. */
  qrCodeDataUrl?: string;
  secret?: string;
  /** Resource payloads for /api/v1/{users,sessions,mfa-recovery-codes,tickets}. */
  data?: unknown;
  meta?: { page: number; pageSize: number; total: number };
}
