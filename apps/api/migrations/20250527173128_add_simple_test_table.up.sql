-- Create a simple test table for PR preview workflow testing
CREATE TABLE preview_test_logs (
    id SERIAL PRIMARY KEY,
    message VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add a sample entry
INSERT INTO preview_test_logs (message) VALUES 
('PR Preview workflow test - database migration applied successfully');