-- Migration: Add role/active_mode to users, create inquiries and saved_listings tables

-- 1. Add role / active_mode column to users
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS role VARCHAR(20) DEFAULT 'buyer' CHECK (role IN ('buyer', 'seller', 'both')),
ADD COLUMN IF NOT EXISTS active_mode VARCHAR(20) DEFAULT 'buyer' CHECK (active_mode IN ('buyer', 'seller'));

-- 2. Create inquiries table (Buyer contacting Seller regarding a boat listing)
CREATE TABLE IF NOT EXISTS inquiries (
    id SERIAL PRIMARY KEY,
    listing_id INTEGER NOT NULL REFERENCES listings(id) ON DELETE CASCADE,
    buyer_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    seller_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    message TEXT NOT NULL,
    buyer_phone VARCHAR(20),
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'replied', 'closed')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_inquiries_listing ON inquiries(listing_id);
CREATE INDEX IF NOT EXISTS idx_inquiries_buyer   ON inquiries(buyer_id);
CREATE INDEX IF NOT EXISTS idx_inquiries_seller  ON inquiries(seller_id);

-- 3. Create saved_listings table (Buyer bookmarks / favorites)
CREATE TABLE IF NOT EXISTS saved_listings (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    listing_id INTEGER NOT NULL REFERENCES listings(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unique_user_listing_saved UNIQUE (user_id, listing_id)
);

CREATE INDEX IF NOT EXISTS idx_saved_user ON saved_listings(user_id);
