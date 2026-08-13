-- CreateTable
CREATE TABLE "users" (
    "user_id" UUID NOT NULL,
    "username" VARCHAR(255) NOT NULL,
    "password" VARCHAR(255) NOT NULL,
    "role" VARCHAR(255) NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "department_name" VARCHAR(255),
    "is_active" BOOLEAN DEFAULT true,
    "biography" VARCHAR(255),
    "password_reset_token" VARCHAR(255),
    "password_reset_expiry" TIMESTAMPTZ,
    "mfa_enabled" BOOLEAN NOT NULL DEFAULT false,
    "mfa_secret" TEXT,
    "mfa_enabled_at" TIMESTAMPTZ,
    "is_deleted" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ,

    CONSTRAINT "users_pkey" PRIMARY KEY ("user_id")
);

-- CreateTable
CREATE TABLE "sessions" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "token_hash" VARCHAR(255) NOT NULL,
    "user_agent" VARCHAR(500),
    "ip_address" VARCHAR(64),
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expires_at" TIMESTAMPTZ NOT NULL,
    "last_seen_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "mfa_recovery_codes" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "code_hash" VARCHAR(255) NOT NULL,
    "used_at" TIMESTAMPTZ,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "mfa_recovery_codes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "audit_logs" (
    "id" UUID NOT NULL,
    "user_id" UUID,
    "event_type" VARCHAR(64) NOT NULL,
    "metadata" JSONB,
    "ip_address" VARCHAR(64),
    "user_agent" VARCHAR(500),
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "audit_logs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_username_key" ON "users"("username");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_department_name_key" ON "users"("department_name");

-- CreateIndex
CREATE UNIQUE INDEX "sessions_token_hash_key" ON "sessions"("token_hash");

-- CreateIndex
CREATE INDEX "sessions_user_id_idx" ON "sessions"("user_id");

-- CreateIndex
CREATE INDEX "mfa_recovery_codes_user_id_idx" ON "mfa_recovery_codes"("user_id");

-- CreateIndex
CREATE INDEX "audit_logs_user_id_idx" ON "audit_logs"("user_id");

-- CreateIndex
CREATE INDEX "audit_logs_event_type_idx" ON "audit_logs"("event_type");

-- AddForeignKey
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mfa_recovery_codes" ADD CONSTRAINT "mfa_recovery_codes_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE SET NULL ON UPDATE CASCADE;
