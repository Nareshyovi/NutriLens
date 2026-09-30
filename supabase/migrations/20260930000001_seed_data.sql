-- Seed Roles
INSERT INTO roles (id, name, description) VALUES 
  ('11111111-1111-1111-1111-111111111111', 'super_admin', 'Full system access'),
  ('22222222-2222-2222-2222-222222222222', 'admin', 'Administrative access'),
  ('33333333-3333-3333-3333-333333333333', 'support_agent', 'Can view users and assist'),
  ('44444444-4444-4444-4444-444444444444', 'content_manager', 'Manages system foods'),
  ('55555555-5555-5555-5555-555555555555', 'analyst', 'Views audit logs and stats')
ON CONFLICT (name) DO NOTHING;

-- Seed Permissions
WITH perms (resource, action) AS (
  VALUES 
    ('users', 'view'), ('users', 'edit'), ('users', 'delete'), ('users', 'export'),
    ('roles', 'view'), ('roles', 'edit'),
    ('system_foods', 'view'), ('system_foods', 'edit'), ('system_foods', 'create'), ('system_foods', 'delete'),
    ('audit_logs', 'view')
)
INSERT INTO permissions (resource, action)
SELECT resource, action FROM perms
ON CONFLICT (resource, action) DO NOTHING;

-- Assign Permissions to Roles
-- super_admin gets everything
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id FROM roles r, permissions p WHERE r.name = 'super_admin'
ON CONFLICT DO NOTHING;

-- admin gets most things except deleting users and editing roles
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id FROM roles r, permissions p 
WHERE r.name = 'admin' AND NOT (p.resource = 'roles' OR p.action = 'delete')
ON CONFLICT DO NOTHING;

-- support_agent views users
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id FROM roles r, permissions p 
WHERE r.name = 'support_agent' AND p.resource = 'users' AND p.action = 'view'
ON CONFLICT DO NOTHING;

-- content_manager edits foods
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id FROM roles r, permissions p 
WHERE r.name = 'content_manager' AND p.resource = 'system_foods'
ON CONFLICT DO NOTHING;

-- analyst views logs
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id FROM roles r, permissions p 
WHERE r.name = 'analyst' AND p.resource = 'audit_logs' AND p.action = 'view'
ON CONFLICT DO NOTHING;


-- Seed System Foods
INSERT INTO foods (id, name, calories_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, is_system_food) VALUES
  (uuid_generate_v4(), 'Roti', 297, 9.8, 56.4, 3.4, true),
  (uuid_generate_v4(), 'Dal (Cooked)', 116, 8.8, 17, 1.4, true),
  (uuid_generate_v4(), 'Idli', 148, 4, 32, 0.4, true),
  (uuid_generate_v4(), 'Chicken Biryani', 160, 12, 19, 5, true),
  (uuid_generate_v4(), 'Paneer', 265, 14, 1.2, 22, true),
  (uuid_generate_v4(), 'Apple', 52, 0.3, 13.8, 0.2, true),
  (uuid_generate_v4(), 'Banana', 89, 1.1, 22.8, 0.3, true),
  (uuid_generate_v4(), 'Chicken Breast (Cooked)', 165, 31, 0, 3.6, true)
ON CONFLICT DO NOTHING;
