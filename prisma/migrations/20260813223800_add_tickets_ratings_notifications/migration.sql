-- CreateTable
CREATE TABLE "tickets" (
    "ticket_number" VARCHAR(100) NOT NULL,
    "applicant_name" VARCHAR(255) NOT NULL,
    "applicant_occupation" VARCHAR(255) NOT NULL,
    "whatsapp_number" VARCHAR(20) NOT NULL,
    "organization_name" VARCHAR(255) NOT NULL,
    "identity_number" VARCHAR(50) NOT NULL,
    "applicant_email" VARCHAR(255) NOT NULL,
    "service_description" TEXT NOT NULL,
    "is_completed" BOOLEAN NOT NULL DEFAULT false,
    "is_deleted" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ,

    CONSTRAINT "tickets_pkey" PRIMARY KEY ("ticket_number")
);

-- CreateTable
CREATE TABLE "ticket_departments" (
    "ticket_department_id" UUID NOT NULL,
    "ticket_number" VARCHAR(100) NOT NULL,
    "department_name" VARCHAR(255) NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ticket_departments_pkey" PRIMARY KEY ("ticket_department_id")
);

-- CreateTable
CREATE TABLE "ticket_progresses" (
    "progress_id" UUID NOT NULL,
    "ticket_number" VARCHAR(100) NOT NULL,
    "progress_name" VARCHAR(255) NOT NULL,
    "date_and_time" TIMESTAMPTZ NOT NULL,
    "progress_note" VARCHAR(255) NOT NULL,
    "follow_up_feedback" VARCHAR(255),
    "estimated_completion" INTEGER,
    "process_description" VARCHAR(255),
    "updated_by" UUID NOT NULL,
    "is_deleted" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ,

    CONSTRAINT "ticket_progresses_pkey" PRIMARY KEY ("progress_id")
);

-- CreateTable
CREATE TABLE "ticket_progress_documents" (
    "document_id" UUID NOT NULL,
    "progress_ticket_id" UUID NOT NULL,
    "uploaded_by" UUID NOT NULL,
    "file_name" VARCHAR(255) NOT NULL,
    "object_key" TEXT NOT NULL,
    "mime_type" VARCHAR(255) NOT NULL,
    "file_size" BIGINT NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ,

    CONSTRAINT "ticket_progress_documents_pkey" PRIMARY KEY ("document_id")
);

-- CreateTable
CREATE TABLE "rating" (
    "rating_id" UUID NOT NULL,
    "rating_value" DECIMAL(4,2),
    "rating_comment" TEXT,
    "ticket_number" VARCHAR(100) NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "rating_pkey" PRIMARY KEY ("rating_id")
);

-- CreateTable
CREATE TABLE "rating_users" (
    "rating_user_id" UUID NOT NULL,
    "rating_id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "created_at" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "rating_users_pkey" PRIMARY KEY ("rating_user_id")
);

-- CreateTable
CREATE TABLE "user_status_snapshots" (
    "status_log_id" UUID NOT NULL,
    "updated_by" UUID NOT NULL,
    "action" VARCHAR(255) NOT NULL,
    "reason" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ,

    CONSTRAINT "user_status_snapshots_pkey" PRIMARY KEY ("status_log_id")
);

-- CreateTable
CREATE TABLE "automation_settings" (
    "setting_id" UUID NOT NULL,
    "updated_by" UUID NOT NULL,
    "whatsapp_enabled" BOOLEAN NOT NULL DEFAULT true,
    "email_enabled" BOOLEAN NOT NULL DEFAULT true,
    "updated_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "automation_settings_pkey" PRIMARY KEY ("setting_id")
);

-- CreateTable
CREATE TABLE "automation_setting_snapshots" (
    "setting_log_id" UUID NOT NULL,
    "updated_by" UUID NOT NULL,
    "whatsapp_enabled" BOOLEAN NOT NULL DEFAULT true,
    "email_enabled" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "automation_setting_snapshots_pkey" PRIMARY KEY ("setting_log_id")
);

-- CreateTable
CREATE TABLE "notification" (
    "notification_id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "progress_ticket_id" UUID NOT NULL,
    "message" TEXT NOT NULL,
    "is_read" BOOLEAN NOT NULL DEFAULT false,
    "is_deleted" BOOLEAN NOT NULL DEFAULT false,
    "read_at" TIMESTAMPTZ,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ,

    CONSTRAINT "notification_pkey" PRIMARY KEY ("notification_id")
);

-- CreateTable
CREATE TABLE "message_delivery_snapshots" (
    "message_delivery_log_id" UUID NOT NULL,
    "progress_id" UUID NOT NULL,
    "channel" VARCHAR(255) NOT NULL,
    "recipient" VARCHAR(255) NOT NULL,
    "provider" VARCHAR(255) NOT NULL,
    "provider_message_id" VARCHAR(255) NOT NULL,
    "delivery_status" VARCHAR(255) NOT NULL,
    "error_message" TEXT NOT NULL,
    "delivered_at" TIMESTAMPTZ NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "message_delivery_snapshots_pkey" PRIMARY KEY ("message_delivery_log_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ticket_departments_ticket_number_department_name_key" ON "ticket_departments"("ticket_number", "department_name");

-- CreateIndex
CREATE INDEX "ticket_departments_ticket_number_idx" ON "ticket_departments"("ticket_number");

-- CreateIndex
CREATE INDEX "ticket_departments_department_name_idx" ON "ticket_departments"("department_name");

-- CreateIndex
CREATE INDEX "ticket_progresses_ticket_number_idx" ON "ticket_progresses"("ticket_number");

-- CreateIndex
CREATE INDEX "ticket_progresses_updated_by_idx" ON "ticket_progresses"("updated_by");

-- CreateIndex
CREATE UNIQUE INDEX "ticket_progress_documents_object_key_key" ON "ticket_progress_documents"("object_key");

-- CreateIndex
CREATE INDEX "ticket_progress_documents_progress_ticket_id_idx" ON "ticket_progress_documents"("progress_ticket_id");

-- CreateIndex
CREATE INDEX "ticket_progress_documents_uploaded_by_idx" ON "ticket_progress_documents"("uploaded_by");

-- CreateIndex
CREATE UNIQUE INDEX "rating_ticket_number_key" ON "rating"("ticket_number");

-- CreateIndex
CREATE UNIQUE INDEX "rating_users_rating_id_user_id_key" ON "rating_users"("rating_id", "user_id");

-- CreateIndex
CREATE INDEX "rating_users_rating_id_idx" ON "rating_users"("rating_id");

-- CreateIndex
CREATE INDEX "rating_users_user_id_idx" ON "rating_users"("user_id");

-- CreateIndex
CREATE INDEX "user_status_snapshots_updated_by_idx" ON "user_status_snapshots"("updated_by");

-- CreateIndex
CREATE UNIQUE INDEX "automation_settings_updated_by_key" ON "automation_settings"("updated_by");

-- CreateIndex
CREATE INDEX "automation_setting_snapshots_updated_by_idx" ON "automation_setting_snapshots"("updated_by");

-- CreateIndex
CREATE INDEX "notification_user_id_idx" ON "notification"("user_id");

-- CreateIndex
CREATE INDEX "notification_progress_ticket_id_idx" ON "notification"("progress_ticket_id");

-- CreateIndex
CREATE INDEX "message_delivery_snapshots_progress_id_idx" ON "message_delivery_snapshots"("progress_id");

-- AddForeignKey
ALTER TABLE "ticket_departments" ADD CONSTRAINT "ticket_departments_ticket_number_fkey" FOREIGN KEY ("ticket_number") REFERENCES "tickets"("ticket_number") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ticket_departments" ADD CONSTRAINT "ticket_departments_department_name_fkey" FOREIGN KEY ("department_name") REFERENCES "users"("department_name") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ticket_progresses" ADD CONSTRAINT "ticket_progresses_ticket_number_fkey" FOREIGN KEY ("ticket_number") REFERENCES "tickets"("ticket_number") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ticket_progresses" ADD CONSTRAINT "ticket_progresses_updated_by_fkey" FOREIGN KEY ("updated_by") REFERENCES "users"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ticket_progress_documents" ADD CONSTRAINT "ticket_progress_documents_progress_ticket_id_fkey" FOREIGN KEY ("progress_ticket_id") REFERENCES "ticket_progresses"("progress_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ticket_progress_documents" ADD CONSTRAINT "ticket_progress_documents_uploaded_by_fkey" FOREIGN KEY ("uploaded_by") REFERENCES "users"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rating" ADD CONSTRAINT "rating_ticket_number_fkey" FOREIGN KEY ("ticket_number") REFERENCES "tickets"("ticket_number") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rating_users" ADD CONSTRAINT "rating_users_rating_id_fkey" FOREIGN KEY ("rating_id") REFERENCES "rating"("rating_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rating_users" ADD CONSTRAINT "rating_users_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_status_snapshots" ADD CONSTRAINT "user_status_snapshots_updated_by_fkey" FOREIGN KEY ("updated_by") REFERENCES "users"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "automation_settings" ADD CONSTRAINT "automation_settings_updated_by_fkey" FOREIGN KEY ("updated_by") REFERENCES "users"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "automation_setting_snapshots" ADD CONSTRAINT "automation_setting_snapshots_updated_by_fkey" FOREIGN KEY ("updated_by") REFERENCES "users"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notification" ADD CONSTRAINT "notification_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notification" ADD CONSTRAINT "notification_progress_ticket_id_fkey" FOREIGN KEY ("progress_ticket_id") REFERENCES "ticket_progresses"("progress_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "message_delivery_snapshots" ADD CONSTRAINT "message_delivery_snapshots_progress_id_fkey" FOREIGN KEY ("progress_id") REFERENCES "ticket_progresses"("progress_id") ON DELETE CASCADE ON UPDATE CASCADE;
