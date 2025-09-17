-- Properties table
CREATE TABLE properties (
    id SERIAL PRIMARY KEY,
    listing_type VARCHAR(50) NOT NULL,
    listing_title VARCHAR(255) NOT NULL,
    property_type VARCHAR(50) NOT NULL,
    shopping_centre_name VARCHAR(255),
    shopping_centre_majors JSONB,
    specialty_count INTEGER,
    shopping_centre_url VARCHAR(500),
    lease_specifics TEXT,
    retail_categories JSONB,
    condition VARCHAR(50) NOT NULL,
    description TEXT NOT NULL,
    minimum_rent DECIMAL(10,2) NOT NULL,
    maximum_rent DECIMAL(10,2),
    outgoings DECIMAL(10,2),
    street_address VARCHAR(500) NOT NULL,
    suburb VARCHAR(100) NOT NULL,
    state VARCHAR(10) NOT NULL,
    postcode VARCHAR(10) NOT NULL,
    size_sqm INTEGER NOT NULL,
    date_available DATE NOT NULL,
    access_details TEXT,
    previous_tenants VARCHAR(500),
    zoning VARCHAR(100),
    storage VARCHAR(100),
    services JSONB,
    utilities JSONB,
    keywords JSONB,
    images JSONB,
    status VARCHAR(20) DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Inquiries table
CREATE TABLE inquiries (
    id SERIAL PRIMARY KEY,
    property_id INTEGER REFERENCES properties(id),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    business_type VARCHAR(100),
    message TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(20) DEFAULT 'new'
);

-- Search logs for analytics
CREATE TABLE search_logs (
    id SERIAL PRIMARY KEY,
    query TEXT NOT NULL,
    extracted_entities JSONB,
    results_count INTEGER,
    user_session VARCHAR(255),
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Users table (for admin access)
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'admin',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for search performance
CREATE INDEX idx_properties_location ON properties(suburb, state, postcode);
CREATE INDEX idx_properties_type ON properties(property_type);
CREATE INDEX idx_properties_rent ON properties(minimum_rent, maximum_rent);
CREATE INDEX idx_properties_size ON properties(size_sqm);
CREATE INDEX idx_properties_available ON properties(date_available);
CREATE INDEX idx_properties_status ON properties(status);
CREATE FULLTEXT INDEX idx_properties_search ON properties(listing_title, description);