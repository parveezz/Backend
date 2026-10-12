CREATE TABLE IF NOT EXISTS listings (
    id           SERIAL PRIMARY KEY,
    title        VARCHAR(100) NOT NULL,
    description  TEXT NOT NULL,
    price        NUMERIC(12, 2) NOT NULL CHECK (price >= 0),
    brand        VARCHAR(100) NOT NULL,
    model        VARCHAR(100) NOT NULL,
    year         SMALLINT NOT NULL CHECK (year BETWEEN 1900 AND 2100),
    condition    VARCHAR(50) NOT NULL,
    location     VARCHAR(100) NOT NULL,
    owner_id     INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    images       TEXT[] NOT NULL DEFAULT '{}',
    created_at   TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at   TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_listings_owner_id ON listings(owner_id);
CREATE INDEX IF NOT EXISTS idx_listings_price    ON listings(price);
CREATE INDEX IF NOT EXISTS idx_listings_year     ON listings(year);
CREATE INDEX IF NOT EXISTS idx_listings_created  ON listings(created_at DESC);