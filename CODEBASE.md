# Autovendia Codebase & Data Dependencies

This document serves as a source of truth for critical data flows, external dependencies, and system architecture specific to the Autovendia project.

## 📊 Data Dependencies

### Dashboard Google (`/dashboard`)

The main dashboard aggregates data from multiple sources to provide a unified view of marketing and sales performance.

| Component        | Dependency Type  | Source / Table               | Details                                                                     |
| ---------------- | ---------------- | ---------------------------- | --------------------------------------------------------------------------- |
| **Core Summary** | **RPC Function** | `dashboard_autovend_summary` | Critical function that aggregates all KPIs. Returns complex JSON structure. |
| **Marketing**    | Table            | `campaigns`, `dailymetrics`  | Synced from Google Ads via n8n integration.                                 |
| **Sales**        | Table            | `leads`, `conversions`       | internal CRM data + offline conversions.                                    |

**Critical Fallback Strategy:**

- **Primary:** Live Database Data via RPC.
- **Empty State:** If valid response but empty arrays, UI shows "No Data" alert.
- **Error State:** If RPC fails, UI shows error card with retry button.
- **Forbidden:** Silent fallback to fixtures (REMOVED in v0.2).

### Leads Management (`/leads`)

- **Service:** `services/leads.ts`
- **Tables:** `leads`, `lead_interactions`, `profiles`
- **Real-time:** Supabase Realtime enabled for `leads` table updates.

### Integrations

- **Service:** `services/integrations.ts`
- **Tables:** `integrations`
- **Logic:** Stores tokens and config for n8n/Google Ads.

## 🛠️ Infrastructure

### Database (Supabase)

- **Project:** `autovendia` (hzsuzblmuxyjiyfkqpci)
- **Region:** us-west-2
- **Postgres Version:** 17.6.1

### Key RPC Functions

1. `dashboard_autovend_summary(filters jsonb)`: Main aggregation logic.
2. `get_user_id_by_email(email text)`: Helper for auth/admin tools.

## 🚨 Troubleshooting

### "Dashboard RPC error"

- **Cause:** Function name mismatch or missing permissions.
- **Fix:** Verify `dashboard_autovend_summary` exists in `public` schema.

### "No Data Found"

- **Cause:** Tables are empty or filters exclude all records.
- **Fix:** Run seed script or connect integrations.
