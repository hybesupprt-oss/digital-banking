-- ACH transfers and payment processing tables

-- ACH transfers table
CREATE TABLE IF NOT EXISTS ach_transfers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    from_account_id UUID REFERENCES accounts(id),
    to_account_id UUID REFERENCES accounts(id),
    external_account_id UUID,
    amount DECIMAL(15,2) NOT NULL CHECK (amount > 0),
    currency VARCHAR(3) DEFAULT 'USD',
    type VARCHAR(10) CHECK (type IN ('debit', 'credit')),
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed', 'cancelled')),
    description TEXT,
    ach_transaction_id VARCHAR(100) UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    processed_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE
);

-- External bank accounts table
CREATE TABLE IF NOT EXISTS external_accounts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    bank_name VARCHAR(255) NOT NULL,
    account_type VARCHAR(20) CHECK (account_type IN ('checking', 'savings')),
    routing_number VARCHAR(9) NOT NULL,
    account_number TEXT NOT NULL, -- Encrypted in production
    account_holder_name VARCHAR(255) NOT NULL,
    verified BOOLEAN DEFAULT FALSE,
    micro_deposit_status VARCHAR(20) DEFAULT 'pending' CHECK (micro_deposit_status IN ('pending', 'sent', 'verified', 'failed')),
    micro_deposit_amounts INTEGER[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    verified_at TIMESTAMP WITH TIME ZONE
);

-- Payment limits table
CREATE TABLE IF NOT EXISTS payment_limits (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    account_id UUID REFERENCES accounts(id) UNIQUE,
    daily_limit DECIMAL(15,2) DEFAULT 5000.00,
    monthly_limit DECIMAL(15,2) DEFAULT 50000.00,
    per_transaction_limit DECIMAL(15,2) DEFAULT 2500.00,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Wire transfers table for high-value transfers
CREATE TABLE IF NOT EXISTS wire_transfers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    from_account_id UUID REFERENCES accounts(id),
    beneficiary_name VARCHAR(255) NOT NULL,
    beneficiary_bank VARCHAR(255) NOT NULL,
    beneficiary_account VARCHAR(100) NOT NULL,
    swift_code VARCHAR(11),
    routing_number VARCHAR(9),
    amount DECIMAL(15,2) NOT NULL CHECK (amount > 0),
    currency VARCHAR(3) DEFAULT 'USD',
    purpose TEXT,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed', 'cancelled')),
    wire_reference VARCHAR(100) UNIQUE,
    fees DECIMAL(10,2) DEFAULT 0.00,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    processed_at TIMESTAMP WITH TIME ZONE
);

-- Add payment limits to existing accounts
ALTER TABLE accounts 
ADD COLUMN IF NOT EXISTS daily_limit DECIMAL(15,2) DEFAULT 5000.00,
ADD COLUMN IF NOT EXISTS monthly_limit DECIMAL(15,2) DEFAULT 50000.00,
ADD COLUMN IF NOT EXISTS per_transaction_limit DECIMAL(15,2) DEFAULT 2500.00;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_ach_transfers_from_account ON ach_transfers(from_account_id);
CREATE INDEX IF NOT EXISTS idx_ach_transfers_status ON ach_transfers(status);
CREATE INDEX IF NOT EXISTS idx_ach_transfers_created_at ON ach_transfers(created_at);
CREATE INDEX IF NOT EXISTS idx_external_accounts_user_id ON external_accounts(user_id);
CREATE INDEX IF NOT EXISTS idx_wire_transfers_from_account ON wire_transfers(from_account_id);

-- Row Level Security
ALTER TABLE ach_transfers ENABLE ROW LEVEL SECURITY;
ALTER TABLE external_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_limits ENABLE ROW LEVEL SECURITY;
ALTER TABLE wire_transfers ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY ach_transfers_user_policy ON ach_transfers
    FOR ALL USING (
        from_account_id IN (SELECT id FROM accounts WHERE user_id = auth.uid()) OR
        to_account_id IN (SELECT id FROM accounts WHERE user_id = auth.uid())
    );

CREATE POLICY external_accounts_user_policy ON external_accounts
    FOR ALL USING (user_id = auth.uid());

CREATE POLICY payment_limits_user_policy ON payment_limits
    FOR ALL USING (account_id IN (SELECT id FROM accounts WHERE user_id = auth.uid()));

CREATE POLICY wire_transfers_user_policy ON wire_transfers
    FOR ALL USING (from_account_id IN (SELECT id FROM accounts WHERE user_id = auth.uid()));
