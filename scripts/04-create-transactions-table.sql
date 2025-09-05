-- Creating transactions table with double-entry ledger capability
CREATE TABLE transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Transaction identification
    transaction_number VARCHAR(30) UNIQUE NOT NULL,
    reference_number VARCHAR(50), -- External reference
    
    -- Account relationships
    from_account_id UUID REFERENCES accounts(id),
    to_account_id UUID REFERENCES accounts(id),
    
    -- Transaction details
    transaction_type transaction_type NOT NULL,
    transaction_status transaction_status DEFAULT 'pending',
    amount DECIMAL(15,2) NOT NULL CHECK (amount > 0),
    fee_amount DECIMAL(8,2) DEFAULT 0.00,
    
    -- Descriptions and metadata
    description TEXT NOT NULL,
    memo TEXT,
    category VARCHAR(50),
    
    -- Processing information
    processed_at TIMESTAMP WITH TIME ZONE,
    processed_by UUID REFERENCES users(id),
    
    -- External integration data
    external_transaction_id VARCHAR(100),
    external_provider VARCHAR(50),
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Constraints
    CONSTRAINT valid_account_relationship CHECK (
        (from_account_id IS NOT NULL OR to_account_id IS NOT NULL) AND
        (from_account_id != to_account_id OR from_account_id IS NULL OR to_account_id IS NULL)
    )
);

-- Indexes for performance
CREATE INDEX idx_transactions_from_account ON transactions(from_account_id);
CREATE INDEX idx_transactions_to_account ON transactions(to_account_id);
CREATE INDEX idx_transactions_status ON transactions(transaction_status);
CREATE INDEX idx_transactions_created_at ON transactions(created_at DESC);
CREATE INDEX idx_transactions_number ON transactions(transaction_number);

-- Function to generate transaction numbers
CREATE OR REPLACE FUNCTION generate_transaction_number()
RETURNS VARCHAR(30) AS $$
DECLARE
    new_number VARCHAR(30);
    exists_check INTEGER;
BEGIN
    LOOP
        -- Generate transaction number with timestamp prefix
        new_number := 'TXN' || TO_CHAR(NOW(), 'YYYYMMDD') || LPAD(FLOOR(RANDOM() * 1000000)::TEXT, 6, '0');
        
        -- Check if it already exists
        SELECT COUNT(*) INTO exists_check FROM transactions WHERE transaction_number = new_number;
        
        -- If unique, return it
        IF exists_check = 0 THEN
            RETURN new_number;
        END IF;
    END LOOP;
END;
$$ LANGUAGE plpgsql;
