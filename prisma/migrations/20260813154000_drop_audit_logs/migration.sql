-- DropForeignKey
ALTER TABLE IF EXISTS "audit_logs" DROP CONSTRAINT IF EXISTS "audit_logs_user_id_fkey";

-- DropTable
DROP TABLE IF EXISTS "audit_logs";
