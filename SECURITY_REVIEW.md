# NutriLens Security Review

> [!WARNING]
> No application is fully secure. Security is a continuous process. This document outlines the baseline defenses implemented in the NutriLens architecture and the known areas requiring ongoing vigilance.

## 1. RLS (Row Level Security) Checklist

| Table | Policy Implementation | Status |
| :--- | :--- | :--- |
| `profiles` | Users can only view/update their own profile (`auth.uid() = id`). Admins can view all. | ✅ Enforced |
| `meal_logs` | Users can only select/insert/update/delete their own logs (`auth.uid() = user_id`). | ✅ Enforced |
| `meal_items`| Cascades from `meal_logs`. Users can only access items tied to their own `meal_logs`. | ✅ Enforced |
| `water_logs` | Isolated to `user_id = auth.uid()`. | ✅ Enforced |
| `weight_logs`| Isolated to `user_id = auth.uid()`. | ✅ Enforced |
| `foods` | System foods (`is_system_food = true`) are readable by all. Custom foods isolated to creator. Admins can edit system foods. | ✅ Enforced |
| `audit_logs` | Insert only via Edge Functions (Service Role). Read-only for `analyst` and `super_admin` via RBAC. | ✅ Enforced |
| `roles` & `permissions` | Readable by all. Editable only by `super_admin`. | ✅ Enforced |

## 2. Threat Model Summary

### Threat: Data Leakage (Cross-Tenant Access)
- **Mitigation:** RLS is enabled on every table. Users cannot read another user's health metrics. Admin endpoints use `has_permission` RPC to strictly enforce RBAC.
- **Residual Risk:** Misconfiguration in future tables. **Action:** Run the pgTAP RLS tests (`20260930000002_tests.sql`) during CI/CD.

### Threat: AI Prompt Injection
- **Mitigation:** The `ai-analyze-meal` Edge Function frames user input strictly as a variable within a rigid JSON-enforced system prompt. User commands are ignored by explicit LLM instructions.
- **Residual Risk:** Advanced adversarial payloads might still cause the LLM to hallucinate. **Action:** Enforce strict Zod schema validation on the LLM output before committing to the database.

### Threat: Privilege Escalation
- **Mitigation:** Admin endpoints (`admin-change-role`) require explicit Edge Function execution. Direct database manipulation of `user_roles` by a standard user is blocked by RLS.
- **Residual Risk:** If a `super_admin` account is compromised, the attacker has full system access. **Action:** Enforce mandatory MFA (TOTP) for all admin roles via Supabase Auth policies.

### Threat: API Abuse / Denial of Service
- **Mitigation:** The AI Edge Function queries `ai_requests` to enforce a per-user daily quota (e.g., 10 requests).
- **Residual Risk:** Brute-forcing the endpoints. **Action:** Configure Supabase API rate limits and Web Application Firewall (WAF) rules at the edge.

## 3. Remaining Manual Tasks

1. **Vault / Encryption at Rest:** Enable `pgsodium` in your Supabase project and map sensitive health fields (e.g., `weight_logs.weight_kg`) to encrypted columns.
2. **Secret Management:** Never commit `.env` files. Ensure `EXPO_PUBLIC_SUPABASE_ANON_KEY` is the only key compiled into the app. Provide `.env.example` in the repo.
3. **MFA Enforcement:** In Supabase Studio > Authentication > Policies, configure MFA enforcement rules that reject logins for users assigned the `admin` or `super_admin` role unless their AAL (Authenticator Assurance Level) is `aal2`.
4. **App Deployment Constraints:** Pin dependencies in `package.json`, run `npm audit fix --force`, and integrate a `gitleaks` pre-commit hook to prevent accidental secret leakage.
5. **Privacy Compliance:** Update the onboarding flow to include a strict, auditable consent check for GDPR / DPDP Act compliance before collecting body metrics.
