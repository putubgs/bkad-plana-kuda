-- CreateTable
CREATE TABLE "rating_links" (
    "rating_link_id" UUID NOT NULL,
    "ticket_number" VARCHAR(100) NOT NULL,
    "token_hash" VARCHAR(255) NOT NULL,
    "expires_at" TIMESTAMPTZ NOT NULL,
    "is_used" BOOLEAN NOT NULL DEFAULT false,
    "used_at" TIMESTAMPTZ,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "rating_links_pkey" PRIMARY KEY ("rating_link_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "rating_links_ticket_number_key" ON "rating_links"("ticket_number");

-- CreateIndex
CREATE UNIQUE INDEX "rating_links_token_hash_key" ON "rating_links"("token_hash");

-- AddForeignKey
ALTER TABLE "rating_links" ADD CONSTRAINT "rating_links_ticket_number_fkey" FOREIGN KEY ("ticket_number") REFERENCES "tickets"("ticket_number") ON DELETE CASCADE ON UPDATE CASCADE;
