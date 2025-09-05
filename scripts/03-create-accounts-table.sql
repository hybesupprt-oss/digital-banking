-- Creating accounts table for banking products
CREATE TABLE accounts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    account_number VARCHAR(20) UNIQUE NOT NULL,
    account_type account_type NOT NULL,
    account_status account_status DEFAULT 'pending',
    
    -- Account details
    account_name VARCHAR(100) NOT NULL,
    balance DECIMAL(15,2) DEFAULT 0.00,
    available_balance DECIMAL(15,2) DEFAULT 0.00,
    
    -- Interest and fees
    interest_rate DECIMAL(5,4) DEFAULT 0.0000,
    monthly_fee DECIMAL(8,2) DEFAULT 0.00,
    overdraft_limit DECIMAL(10,2) DEFAULT 0.00,
    
    -- Account limits
    daily_withdrawal_limit DECIMAL(10,2) DEFAULT 500.00,
    daily_transfer_limit DECIMAL(10,2) DEFAULT 1000.00,
    
    -- Timestamps
    opened_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    closed_at TIMESTAMP WITH TIME ZONE,
    last_activity_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_accounts_user_id ON accounts(user_id);
CREATE INDEX idx_accounts_account_number ON accounts(account_number);
CREATE INDEX idx_accounts_type_status ON accounts(account_type, account_status);

-- Function to generate account numbers
CREATE OR REPLACE FUNCTION generate_account_number()
RETURNS VARCHAR(20) AS $$
DECLARE
    new_number VARCHAR(20);
    exists_check INTEGER;
BEGIN
    LOOP
        -- Generate 12-digit account number with prefix
        new_number := '1001' || LPAD(FLOOR(RANDOM() * 100000000)::TEXT, 8, '0');
        
        -- Check if it already exists
        SELECT COUNT(*) INTO exists_check FROM accounts WHERE account_number = new_number;
        
        -- If unique, return it
        IF exists_check = 0 THEN
            RETURN new_number;
        END IF;
    END LOOP;
END;
$$ LANGUAGE plpgsql;
