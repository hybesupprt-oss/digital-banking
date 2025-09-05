-- Enhanced security tables for production banking

-- Security events table for comprehensive audit logging
CREATE TABLE IF NOT EXISTS security_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    session_id UUID,
    event_type VARCHAR(50) NOT NULL,
    ip_address INET,
    user_agent TEXT,
    risk_score INTEGER DEFAULT 0,
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Device fingerprints for fraud detection
CREATE TABLE IF NOT EXISTS device_fingerprints (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    fingerprint VARCHAR(64) UNIQUE NOT NULL,
    device_name VARCHAR(255),
    trusted BOOLEAN DEFAULT FALSE,
    last_seen TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enhanced sessions table with security features
DROP TABLE IF EXISTS sessions;
CREATE TABLE sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    device_fingerprint VARCHAR(64),
    ip_address INET,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_activity TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    revoked BOOLEAN DEFAULT FALSE
);

-- Multi-factor authentication table
CREATE TABLE IF NOT EXISTS mfa_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) UNIQUE,
    secret VARCHAR(255),
    backup_codes TEXT[],
    enabled BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Encrypted PII storage table
CREATE TABLE IF NOT EXISTS encrypted_pii (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    field_name VARCHAR(100) NOT NULL,
    encrypted_data TEXT NOT NULL,
    iv VARCHAR(32) NOT NULL,
    tag VARCHAR(32) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_security_events_user_id ON security_events(user_id);
CREATE INDEX IF NOT EXISTS idx_security_events_created_at ON security_events(created_at);
CREATE INDEX IF NOT EXISTS idx_device_fingerprints_user_id ON device_fingerprints(user_id);
CREATE INDEX IF NOT EXISTS idx_sessions_user_id ON sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_sessions_expires_at ON sessions(expires_at);
CREATE INDEX IF NOT EXISTS idx_encrypted_pii_user_id ON encrypted_pii(user_id);

-- Row Level Security policies
ALTER TABLE security_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE device_fingerprints ENABLE ROW LEVEL SECURITY;
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE mfa_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE encrypted_pii ENABLE ROW LEVEL SECURITY;

-- Users can only see their own security events
CREATE POLICY security_events_user_policy ON security_events
    FOR ALL USING (user_id = auth.uid());

-- Users can only see their own device fingerprints
CREATE POLICY device_fingerprints_user_policy ON device_fingerprints
    FOR ALL USING (user_id = auth.uid());

-- Users can only see their own sessions
CREATE POLICY sessions_user_policy ON sessions
    FOR ALL USING (user_id = auth.uid());

-- Users can only see their own MFA settings
CREATE POLICY mfa_settings_user_policy ON mfa_settings
    FOR ALL USING (user_id = auth.uid());

-- Users can only see their own encrypted PII
CREATE POLICY encrypted_pii_user_policy ON encrypted_pii
    FOR ALL USING (user_id = auth.uid());
