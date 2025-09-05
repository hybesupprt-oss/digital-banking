-- Advanced KYC and biometric verification tables

-- Enhanced KYC submissions with biometric data
ALTER TABLE kyc_submissions 
ADD COLUMN IF NOT EXISTS biometric_verification_id UUID,
ADD COLUMN IF NOT EXISTS document_verification_id UUID,
ADD COLUMN IF NOT EXISTS risk_score INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS risk_level VARCHAR(20) DEFAULT 'medium' CHECK (risk_level IN ('low', 'medium', 'high')),
ADD COLUMN IF NOT EXISTS aml_screening_status VARCHAR(20) DEFAULT 'pending' CHECK (aml_screening_status IN ('pending', 'cleared', 'flagged', 'requires_review')),
ADD COLUMN IF NOT EXISTS verification_method VARCHAR(50) DEFAULT 'standard' CHECK (verification_method IN ('standard', 'enhanced', 'biometric', 'video_call')),
ADD COLUMN IF NOT EXISTS compliance_flags TEXT[],
ADD COLUMN IF NOT EXISTS reviewer_notes TEXT;

-- Biometric verification records
CREATE TABLE IF NOT EXISTS biometric_verifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    session_id VARCHAR(255),
    face_descriptor DECIMAL[],
    liveness_score DECIMAL(5,4) CHECK (liveness_score >= 0 AND liveness_score <= 1),
    confidence_score DECIMAL(5,4) CHECK (confidence_score >= 0 AND confidence_score <= 1),
    document_match BOOLEAN DEFAULT FALSE,
    spoofing_detected BOOLEAN DEFAULT FALSE,
    verification_status VARCHAR(20) DEFAULT 'pending' CHECK (verification_status IN ('pending', 'passed', 'failed', 'requires_retry')),
    device_info JSONB,
    ip_address INET,
    attempts INTEGER DEFAULT 1,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE
);

-- Document verification records
CREATE TABLE IF NOT EXISTS document_verifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    document_type VARCHAR(50) CHECK (document_type IN ('passport', 'drivers_license', 'national_id', 'utility_bill', 'bank_statement')),
    document_number VARCHAR(100),
    extracted_data JSONB,
    ocr_confidence DECIMAL(5,4) CHECK (ocr_confidence >= 0 AND ocr_confidence <= 1),
    document_quality DECIMAL(5,4) CHECK (document_quality >= 0 AND document_quality <= 1),
    tampering_detected BOOLEAN DEFAULT FALSE,
    verification_status VARCHAR(20) DEFAULT 'pending' CHECK (verification_status IN ('pending', 'verified', 'rejected', 'requires_review')),
    review_notes TEXT,
    document_url TEXT, -- Encrypted storage URL
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    verified_at TIMESTAMP WITH TIME ZONE
);

-- AML screening results
CREATE TABLE IF NOT EXISTS aml_screenings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    screening_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    watchlist_matches JSONB DEFAULT '[]',
    pep_status BOOLEAN DEFAULT FALSE,
    sanctions_match BOOLEAN DEFAULT FALSE,
    adverse_media BOOLEAN DEFAULT FALSE,
    risk_score INTEGER DEFAULT 0 CHECK (risk_score >= 0 AND risk_score <= 100),
    risk_level VARCHAR(20) DEFAULT 'low' CHECK (risk_level IN ('low', 'medium', 'high')),
    requires_manual_review BOOLEAN DEFAULT FALSE,
    screening_provider VARCHAR(100),
    reference_id VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Compliance audit trail
CREATE TABLE IF NOT EXISTS compliance_audits (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    audit_type VARCHAR(50) CHECK (audit_type IN ('kyc_review', 'aml_screening', 'risk_assessment', 'document_review', 'manual_override')),
    performed_by UUID REFERENCES users(id),
    previous_status VARCHAR(50),
    new_status VARCHAR(50),
    reason TEXT,
    evidence JSONB,
    regulatory_requirement VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enhanced identity documents storage
CREATE TABLE IF NOT EXISTS identity_documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    document_type VARCHAR(50) NOT NULL,
    document_subtype VARCHAR(50),
    encrypted_file_path TEXT NOT NULL,
    file_hash VARCHAR(128) NOT NULL,
    encryption_key_id VARCHAR(255),
    mime_type VARCHAR(100),
    file_size INTEGER,
    upload_ip INET,
    retention_until DATE,
    access_log JSONB DEFAULT '[]',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Liveness detection challenges
CREATE TABLE IF NOT EXISTS liveness_challenges (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    biometric_verification_id UUID REFERENCES biometric_verifications(id),
    challenge_type VARCHAR(50) CHECK (challenge_type IN ('blink', 'head_turn_left', 'head_turn_right', 'smile', 'nod')),
    challenge_instruction TEXT,
    response_detected BOOLEAN DEFAULT FALSE,
    confidence_score DECIMAL(5,4),
    timestamp_issued TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    timestamp_completed TIMESTAMP WITH TIME ZONE
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_biometric_verifications_user_id ON biometric_verifications(user_id);
CREATE INDEX IF NOT EXISTS idx_biometric_verifications_status ON biometric_verifications(verification_status);
CREATE INDEX IF NOT EXISTS idx_document_verifications_user_id ON document_verifications(user_id);
CREATE INDEX IF NOT EXISTS idx_document_verifications_status ON document_verifications(verification_status);
CREATE INDEX IF NOT EXISTS idx_aml_screenings_user_id ON aml_screenings(user_id);
CREATE INDEX IF NOT EXISTS idx_aml_screenings_risk_level ON aml_screenings(risk_level);
CREATE INDEX IF NOT EXISTS idx_compliance_audits_user_id ON compliance_audits(user_id);
CREATE INDEX IF NOT EXISTS idx_compliance_audits_audit_type ON compliance_audits(audit_type);
CREATE INDEX IF NOT EXISTS idx_identity_documents_user_id ON identity_documents(user_id);
CREATE INDEX IF NOT EXISTS idx_liveness_challenges_verification_id ON liveness_challenges(biometric_verification_id);

-- Row Level Security
ALTER TABLE biometric_verifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE document_verifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE aml_screenings ENABLE ROW LEVEL SECURITY;
ALTER TABLE compliance_audits ENABLE ROW LEVEL SECURITY;
ALTER TABLE identity_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE liveness_challenges ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY biometric_verifications_user_policy ON biometric_verifications
    FOR ALL USING (user_id = auth.uid());

CREATE POLICY document_verifications_user_policy ON document_verifications
    FOR ALL USING (user_id = auth.uid());

CREATE POLICY aml_screenings_user_policy ON aml_screenings
    FOR ALL USING (user_id = auth.uid());

CREATE POLICY identity_documents_user_policy ON identity_documents
    FOR ALL USING (user_id = auth.uid());

-- Admin policies for compliance audits
CREATE POLICY compliance_audits_admin_policy ON compliance_audits
    FOR ALL USING (
        auth.uid() IN (SELECT id FROM users WHERE role IN ('admin', 'compliance_officer'))
    );

CREATE POLICY liveness_challenges_user_policy ON liveness_challenges
    FOR ALL USING (
        biometric_verification_id IN (
            SELECT id FROM biometric_verifications WHERE user_id = auth.uid()
        )
    );

-- Insert sample compliance requirements
CREATE TABLE IF NOT EXISTS compliance_requirements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    requirement_type VARCHAR(100) NOT NULL,
    jurisdiction VARCHAR(10) DEFAULT 'US',
    description TEXT,
    mandatory BOOLEAN DEFAULT TRUE,
    effective_date DATE DEFAULT CURRENT_DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

INSERT INTO compliance_requirements (requirement_type, description) VALUES 
('PATRIOT_ACT', 'USA PATRIOT Act customer identification requirements'),
('BSA_CIP', 'Bank Secrecy Act Customer Identification Program'),
('OFAC_SCREENING', 'Office of Foreign Assets Control sanctions screening'),
('KYC_ENHANCED', 'Enhanced Know Your Customer due diligence'),
('AML_MONITORING', 'Anti-Money Laundering transaction monitoring')
ON CONFLICT DO NOTHING;
