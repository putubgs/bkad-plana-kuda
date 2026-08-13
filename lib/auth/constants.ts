// Kept dependency-free (no server-only imports) so proxy.ts can read it
// without pulling in Prisma/pg into the proxy bundle.
export const SESSION_COOKIE_NAME = "session_token";
export const MFA_PENDING_COOKIE_NAME = "mfa_pending_token";
export const FORGOT_PASSWORD_MFA_PENDING_COOKIE_NAME = "forgot_password_mfa_pending_token";
