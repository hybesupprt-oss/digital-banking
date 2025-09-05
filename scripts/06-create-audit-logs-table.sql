-- Creating audit logs table for security and compliance
CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- User and session information
    user_id UUID REFERENCES users(id),
    session_id VARCHAR(255),
    
    -- Action details
    action audit_action NOT NULL,
    resource_type VARCHAR(50) NOT NULL, -- 'user', 'account', 'transaction', etc.
    resource_id UUID,
    
    -- Request details
    ip_address INET,
    user_agent TEXT,
    request_method VARCHAR(10),
    request_path TEXT,
    
    -- Change tracking
    old_values JSONB,
    new_values JSONB,
    
    -- Additional context
    description TEXT,
    metadata JSONB,
    
    -- Risk assessment
    risk_score INTEGER CHECK (risk_score >= 0 AND risk_score <= 100),
    flagged_for_review BOOLEAN DEFAULT false,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance and compliance queries
CREATE INDEX idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_action ON audit_logs(action);
CREATE INDEX idx_audit_logs_created_at ON audit_logs(created_at DESC);
CREATE INDEX idx_audit_logs_resource ON audit_logs(resource_type, resource_id);
CREATE INDEX idx_audit_logs_flagged ON audit_logs(flagged_for_review) WHERE flagged_for_review = true;
CREATE INDEX idx_audit_logs_ip_address ON audit_logs(ip_address);
