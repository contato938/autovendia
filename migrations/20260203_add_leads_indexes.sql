-- Migration: Add index for leads query performance
-- Created: 2026-02-03
-- Description: Adds composite index on tenant_id + created_at for faster lead queries

-- Drop index if exists (idempotent)
DROP INDEX IF EXISTS idx_leads_tenant_created;

-- Create composite index for the most common query pattern
-- This speeds up: WHERE tenant_id = X ORDER BY created_at DESC
CREATE INDEX idx_leads_tenant_created 
ON leads (tenant_id, created_at DESC);

-- Optional: Add index on stage for kanban board filtering
DROP INDEX IF EXISTS idx_leads_stage;
CREATE INDEX idx_leads_stage 
ON leads (stage);

-- ANALYZE to update query planner statistics
ANALYZE leads;
