-- Create a test table for PR preview workflow testing
CREATE TABLE test_pr_preview (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add some sample data
INSERT INTO test_pr_preview (name, description) VALUES 
('PR Preview Test', 'This table was created to test the PR preview workflow'),
('Database Migration', 'Testing schema diff functionality');