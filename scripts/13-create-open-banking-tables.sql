-- Open Banking and external account linking tables

-- Open Banking consents
CREATE TABLE IF NOT EXISTS open_banking_consents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    provider_id VARCHAR(100) NOT NULL,
    institution_id VARCHAR(100),
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'expired', 'revoked', 'failed')),
    consent_url TEXT,
    redirect_url TEXT,
    access_token TEXT,
    refresh_token TEXT,
    token_expires_at TIMESTAMP WITH TIME ZONE,
    expires_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE,
    revoked_at TIMESTAMP WITH TIME ZONE
);

-- Linked external accounts
CREATE TABLE IF NOT EXISTS linked_accounts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    provider_id VARCHAR(100) NOT NULL,
    institution_id VARCHAR(100) NOT NULL,
    institution_name VARCHAR(255) NOT NULL,
    account_id VARCHAR(255) NOT NULL,
    account_type VARCHAR(50) CHECK (account_type IN ('checking', 'savings', 'credit', 'investment', 'loan')),
    account_name VARCHAR(255),
    account_number VARCHAR(100), -- Masked for security
    sort_code VARCHAR(10),
    iban VARCHAR(34),
    balance DECIMAL(15,2) DEFAULT 0.00,
    available_balance DECIMAL(15,2),
    currency VARCHAR(3) DEFAULT 'USD',
    last_synced TIMESTAMP WITH TIME ZONE,
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'error', 'consent_expired')),
    consent_id UUID REFERENCES open_banking_consents(id),
    consent_expires_at TIMESTAMP WITH TIME ZONE,
    sync_frequency INTEGER DEFAULT 3600, -- seconds
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    disconnected_at TIMESTAMP WITH TIME ZONE,
    UNIQUE(provider_id, account_id)
);

-- External transactions from linked accounts
CREATE TABLE IF NOT EXISTS external_transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    linked_account_id UUID REFERENCES linked_accounts(id),
    transaction_id VARCHAR(255) UNIQUE NOT NULL,
    amount DECIMAL(15,2) NOT NULL,
    currency VARCHAR(3) NOT NULL,
    description TEXT,
    merchant_name VARCHAR(255),
    merchant_category VARCHAR(100),
    category VARCHAR(100),
    subcategory VARCHAR(100),
    date TIMESTAMP WITH TIME ZONE NOT NULL,
    booking_date TIMESTAMP WITH TIME ZONE,
    value_date TIMESTAMP WITH TIME ZONE,
    balance DECIMAL(15,2),
    type VARCHAR(10) CHECK (type IN ('debit', 'credit')),
    status VARCHAR(20) DEFAULT 'completed' CHECK (status IN ('pending', 'completed', 'failed', 'cancelled')),
    reference VARCHAR(255),
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Open Banking providers and institutions
CREATE TABLE IF NOT EXISTS open_banking_providers (
    id VARCHAR(100) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    country VARCHAR(2) NOT NULL,
    logo_url TEXT,
    website_url TEXT,
    supported BOOLEAN DEFAULT TRUE,
    capabilities TEXT[] DEFAULT '{}',
    api_version VARCHAR(20),
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Account sync logs for monitoring
CREATE TABLE IF NOT EXISTS account_sync_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    linked_account_id UUID REFERENCES linked_accounts(id),
    sync_type VARCHAR(50) CHECK (sync_type IN ('balance', 'transactions', 'account_info', 'full')),
    status VARCHAR(20) CHECK (status IN ('started', 'completed', 'failed', 'partial')),
    records_synced INTEGER DEFAULT 0,
    error_message TEXT,
    started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE,
    duration_ms INTEGER
);

-- Aggregated account balances view
CREATE OR REPLACE VIEW aggregated_balances AS
SELECT 
    user_id,
    COUNT(*) as account_count,
    SUM(balance) as total_balance,
    SUM(available_balance) as total_available,
    array_agg(DISTINCT currency) as currencies,
    MAX(last_synced) as last_sync
FROM linked_accounts 
WHERE status = 'active'
GROUP BY user_id;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_open_banking_consents_user_id ON open_banking_consents(user_id);
CREATE INDEX IF NOT EXISTS idx_open_banking_consents_status ON open_banking_consents(status);
CREATE INDEX IF NOT EXISTS idx_linked_accounts_user_id ON linked_accounts(user_id);
CREATE INDEX IF NOT EXISTS idx_linked_accounts_status ON linked_accounts(status);
CREATE INDEX IF NOT EXISTS idx_linked_accounts_provider ON linked_accounts(provider_id);
CREATE INDEX IF NOT EXISTS idx_external_transactions_account_id ON external_transactions(linked_account_id);
CREATE INDEX IF NOT EXISTS idx_external_transactions_date ON external_transactions(date);
CREATE INDEX IF NOT EXISTS idx_external_transactions_category ON external_transactions(category);
CREATE INDEX IF NOT EXISTS idx_account_sync_logs_account_id ON account_sync_logs(linked_account_id);

-- Insert supported providers
INSERT INTO open_banking_providers (id, name, country, supported, capabilities) VALUES 
('chase', 'JPMorgan Chase', 'US', true, ARRAY['accounts', 'transactions', 'balances', 'payments']),
('bofa', 'Bank of America', 'US', true, ARRAY['accounts', 'transactions', 'balances']),
('citi', 'Citibank', 'US', true, ARRAY['accounts', 'transactions', 'balances', 'payments']),
('wells_fargo', 'Wells Fargo', 'US', true, ARRAY['accounts', 'transactions', 'balances']),
('amex', 'American Express', 'US', true, ARRAY['accounts', 'transactions', 'balances']),
('capital_one', 'Capital One', 'US', true, ARRAY['accounts', 'transactions', 'balances']),
('usbank', 'U.S. Bank', 'US', true, ARRAY['accounts', 'transactions', 'balances']),
('pnc', 'PNC Bank', 'US', true, ARRAY['accounts', 'transactions', 'balances']),
('td', 'TD Bank', 'US', true, ARRAY['accounts', 'transactions', 'balances']),
('schwab', 'Charles Schwab', 'US', true, ARRAY['accounts', 'transactions', 'balances', 'investments'])
ON CONFLICT (id) DO UPDATE SET 
    name = EXCLUDED.name,
    supported = EXCLUDED.supported,
    capabilities = EXCLUDED.capabilities,
    last_updated = NOW();

-- Row Level Security
ALTER TABLE open_banking_consents ENABLE ROW LEVEL SECURITY;
ALTER TABLE linked_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE external_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE account_sync_logs ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY open_banking_consents_user_policy ON open_banking_consents
    FOR ALL USING (user_id = auth.uid());

CREATE POLICY linked_accounts_user_policy ON linked_accounts
    FOR ALL USING (user_id = auth.uid());

CREATE POLICY external_transactions_user_policy ON external_transactions
    FOR ALL USING (
        linked_account_id IN (SELECT id FROM linked_accounts WHERE user_id = auth.uid())
    );

CREATE POLICY account_sync_logs_user_policy ON account_sync_logs
    FOR ALL USING (
        linked_account_id IN (SELECT id FROM linked_accounts WHERE user_id = auth.uid())
    );

-- Open Banking providers are public read-only
ALTER TABLE open_banking_providers ENABLE ROW LEVEL SECURITY;
CREATE POLICY open_banking_providers_public_read ON open_banking_providers
    FOR SELECT USING (true);

-- Function to automatically sync account balances
CREATE OR REPLACE FUNCTION sync_account_balance()
RETURNS TRIGGER AS $$
BEGIN
    -- Update the aggregated balance when external transactions change
    UPDATE linked_accounts 
    SET last_synced = NOW()
    WHERE id = NEW.linked_account_id;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update sync timestamp
CREATE TRIGGER trigger_sync_account_balance
    AFTER INSERT OR UPDATE ON external_transactions
    FOR EACH ROW
    EXECUTE FUNCTION sync_account_balance();
