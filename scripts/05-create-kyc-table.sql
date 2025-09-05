-- Creating KYC submissions table for compliance tracking
CREATE TABLE kyc_submissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    
    -- Submission details
    submission_type VARCHAR(50) NOT NULL, -- 'initial', 'update', 'renewal'
    kyc_status kyc_status DEFAULT 'pending',
    
    -- Identity verification documents
    identity_document_type VARCHAR(50), -- 'drivers_license', 'passport', 'state_id'
    identity_document_number VARCHAR(100),
    identity_document_expiry DATE,
    identity_document_url TEXT, -- Secure document storage URL
    
    -- Address verification
    address_document_type VARCHAR(50), -- 'utility_bill', 'bank_statement', 'lease'
    address_document_url TEXT,
    
    -- Income verification (for loans/credit)
    income_document_type VARCHAR(50),
    income_document_url TEXT,
    annual_income DECIMAL(12,2),
    employment_status VARCHAR(50),
    employer_name VARCHAR(200),
    
    -- Review information
    reviewed_by UUID REFERENCES users(id),
    reviewed_at TIMESTAMP WITH TIME ZONE,
    review_notes TEXT,
    rejection_reason TEXT,
    
    -- Compliance flags
    sanctions_check_passed BOOLEAN,
    pep_check_passed BOOLEAN, -- Politically Exposed Person
    adverse_media_check_passed BOOLEAN,
    
    -- Timestamps
    submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expires_at TIMESTAMP WITH TIME ZONE, -- For periodic re-verification
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_kyc_user_id ON kyc_submissions(user_id);
CREATE INDEX idx_kyc_status ON kyc_submissions(kyc_status);
CREATE INDEX idx_kyc_submitted_at ON kyc_submissions(submitted_at DESC);
