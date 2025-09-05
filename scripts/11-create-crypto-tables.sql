-- Crypto wallets and transactions tables

-- Crypto wallets table
CREATE TABLE IF NOT EXISTS crypto_wallets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    type VARCHAR(20) CHECK (type IN ('bitcoin', 'lightning', 'stellar')),
    public_key TEXT NOT NULL,
    encrypted_private_key TEXT NOT NULL,
    address VARCHAR(255) NOT NULL,
    balance DECIMAL(20,8) DEFAULT 0.00000000,
    balance_usd DECIMAL(15,2) DEFAULT 0.00,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_sync_at TIMESTAMP WITH TIME ZONE
);

-- Crypto transactions table
CREATE TABLE IF NOT EXISTS crypto_transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    wallet_id UUID REFERENCES crypto_wallets(id),
    type VARCHAR(10) CHECK (type IN ('send', 'receive')),
    amount DECIMAL(20,8) NOT NULL,
    currency VARCHAR(10) NOT NULL,
    to_address TEXT,
    from_address TEXT,
    tx_hash VARCHAR(128) UNIQUE,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'failed')),
    confirmations INTEGER DEFAULT 0,
    fees DECIMAL(20,8) DEFAULT 0.00000000,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    confirmed_at TIMESTAMP WITH TIME ZONE
);

-- Exchange rates table for crypto pricing
CREATE TABLE IF NOT EXISTS exchange_rates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    currency VARCHAR(10) NOT NULL,
    usd_rate DECIMAL(15,8) NOT NULL,
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(currency)
);

-- Lightning invoices table
CREATE TABLE IF NOT EXISTS lightning_invoices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    wallet_id UUID REFERENCES crypto_wallets(id),
    invoice_string TEXT NOT NULL,
    amount DECIMAL(20,8) NOT NULL,
    description TEXT,
    expires_at TIMESTAMP WITH TIME ZONE,
    paid BOOLEAN DEFAULT FALSE,
    paid_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Stellar assets table for multi-currency support
CREATE TABLE IF NOT EXISTS stellar_assets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    asset_code VARCHAR(12) NOT NULL,
    asset_issuer VARCHAR(56),
    asset_type VARCHAR(20) CHECK (asset_type IN ('native', 'credit_alphanum4', 'credit_alphanum12')),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_crypto_wallets_user_id ON crypto_wallets(user_id);
CREATE INDEX IF NOT EXISTS idx_crypto_wallets_type ON crypto_wallets(type);
CREATE INDEX IF NOT EXISTS idx_crypto_transactions_wallet_id ON crypto_transactions(wallet_id);
CREATE INDEX IF NOT EXISTS idx_crypto_transactions_status ON crypto_transactions(status);
CREATE INDEX IF NOT EXISTS idx_crypto_transactions_created_at ON crypto_transactions(created_at);
CREATE INDEX IF NOT EXISTS idx_lightning_invoices_wallet_id ON lightning_invoices(wallet_id);
CREATE INDEX IF NOT EXISTS idx_exchange_rates_currency ON exchange_rates(currency);

-- Insert initial exchange rates
INSERT INTO exchange_rates (currency, usd_rate) VALUES 
('BTC', 45000.00000000),
('XLM', 0.12000000),
('ETH', 2500.00000000)
ON CONFLICT (currency) DO UPDATE SET 
    usd_rate = EXCLUDED.usd_rate,
    last_updated = NOW();

-- Insert initial Stellar assets
INSERT INTO stellar_assets (asset_code, asset_type) VALUES 
('XLM', 'native'),
('USD', 'credit_alphanum4'),
('EUR', 'credit_alphanum4')
ON CONFLICT DO NOTHING;

-- Row Level Security
ALTER TABLE crypto_wallets ENABLE ROW LEVEL SECURITY;
ALTER TABLE crypto_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE lightning_invoices ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY crypto_wallets_user_policy ON crypto_wallets
    FOR ALL USING (user_id = auth.uid());

CREATE POLICY crypto_transactions_user_policy ON crypto_transactions
    FOR ALL USING (wallet_id IN (SELECT id FROM crypto_wallets WHERE user_id = auth.uid()));

CREATE POLICY lightning_invoices_user_policy ON lightning_invoices
    FOR ALL USING (wallet_id IN (SELECT id FROM crypto_wallets WHERE user_id = auth.uid()));

-- Exchange rates and stellar assets are public read-only
ALTER TABLE exchange_rates ENABLE ROW LEVEL SECURITY;
ALTER TABLE stellar_assets ENABLE ROW LEVEL SECURITY;

CREATE POLICY exchange_rates_public_read ON exchange_rates
    FOR SELECT USING (true);

CREATE POLICY stellar_assets_public_read ON stellar_assets
    FOR SELECT USING (true);
