-- Creating enums for banking application
-- Account types supported by the credit union
CREATE TYPE account_type AS ENUM ('checking', 'savings', 'loan', 'credit_card');

-- Account status for lifecycle management
CREATE TYPE account_status AS ENUM ('active', 'inactive', 'closed', 'frozen', 'pending');

-- Transaction types for double-entry bookkeeping
CREATE TYPE transaction_type AS ENUM ('debit', 'credit', 'transfer', 'fee', 'interest', 'deposit', 'withdrawal');

-- Transaction status for processing workflow
CREATE TYPE transaction_status AS ENUM ('pending', 'completed', 'failed', 'cancelled', 'reversed');

-- KYC verification status
CREATE TYPE kyc_status AS ENUM ('pending', 'in_review', 'approved', 'rejected', 'expired');

-- User roles for access control
CREATE TYPE user_role AS ENUM ('member', 'admin', 'teller', 'manager');

-- Audit action types
CREATE TYPE audit_action AS ENUM ('create', 'update', 'delete', 'login', 'logout', 'transaction', 'kyc_update');
