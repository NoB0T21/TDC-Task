-- Insert default matchmakers for development/demo (Female & Male)
-- Password: "password123"
INSERT INTO matchmakers (email, name, password_hash) VALUES
  ('demo@thedatecrew.com', 'Priya Sharma', '$2b$10$HTbygfLAHDXnLSaxhBWX8.Fqn16ywpl/xqsWdnSCoZnivn5GiRhw2'),
  ('arjun@thedatecrew.com', 'Arjun Kapoor', '$2b$10$HTbygfLAHDXnLSaxhBWX8.Fqn16ywpl/xqsWdnSCoZnivn5GiRhw2')
ON CONFLICT (email) DO NOTHING;
