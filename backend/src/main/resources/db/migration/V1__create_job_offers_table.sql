CREATE TABLE job_offers (
    id UUID PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    company VARCHAR(255) NOT NULL,
    location VARCHAR(255),
    offer_url VARCHAR(500) NOT NULL,
    salary NUMERIC,
    contact_name VARCHAR(255),
    status VARCHAR(50) NOT NULL DEFAULT 'WISHLIST' CHECK (status IN ('WISHLIST', 'APPLIED', 'INTERVIEW', 'OFFER', 'REJECTED')),
    contacted BOOLEAN NOT NULL DEFAULT FALSE,
    response VARCHAR(50) NOT NULL DEFAULT 'PENDING' CHECK (response IN ('PENDING', 'YES', 'NO')),
    remote_work VARCHAR(50) NOT NULL DEFAULT 'NONE' CHECK (remote_work IN ('NONE', 'PARTIAL', 'OCCASIONAL')),
    application_date DATE NOT NULL,
    notes TEXT
);
