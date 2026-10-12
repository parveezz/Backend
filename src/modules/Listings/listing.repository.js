import pool from "../../config/db.js";

// 1. Create a listing
export const createListing = async (data) => {
    const {
        title,
        description,
        brand,
        model,
        year,
        condition,
        price,
        location,
        images = [],
        ownerId,
    } = data;

    const result = await pool.query(
        `INSERT INTO listings (
            title,
            description,
            brand,
            model,
            year,
            condition,
            price,
            location,
            images,
            owner_id
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
        RETURNING *`,
        [
            title,
            description,
            brand,
            model,
            Number(year),
            condition,
            Number(price),
            location,
            images,
            ownerId,
        ]
    );

    return result.rows[0];
};

// 2. Get all listings with pagination (showing seller info to buyers)
export const getAllListings = async (limit = 10, offset = 0) => {
    const result = await pool.query(
        `SELECT 
            l.*,
            u.id AS seller_id,
            u.name AS seller_name,
            u.email AS seller_email
         FROM listings l
         JOIN users u ON l.owner_id = u.id
         ORDER BY l.created_at DESC
         LIMIT $1 OFFSET $2`,
        [limit, offset]
    );

    return result.rows;
};

// Count total listings for pagination
export const countListings = async () => {
    const result = await pool.query(`SELECT COUNT(*) AS total FROM listings`);
    return parseInt(result.rows[0].total, 10);
};

// 3. Get a listing by ID (includes seller profile for interested buyers)
export const getListingById = async (id) => {
    const result = await pool.query(
        `SELECT 
            l.*,
            u.id AS seller_id,
            u.name AS seller_name,
            u.email AS seller_email
         FROM listings l
         JOIN users u ON l.owner_id = u.id
         WHERE l.id = $1`,
        [id]
    );

    return result.rows[0] || null;
};

// 4. Get listings belonging to one owner
export const getMyListings = async (ownerId) => {
    const result = await pool.query(
        `SELECT *
         FROM listings
         WHERE owner_id = $1
         ORDER BY created_at DESC`,
        [ownerId]
    );

    return result.rows;
};

// 5. Update a listing (owner only)
export const updateListing = async (id, ownerId, data) => {
    const {
        title,
        description,
        brand,
        model,
        year,
        condition,
        price,
        location,
        images,
    } = data;

    const result = await pool.query(
        `UPDATE listings
         SET
            title = COALESCE($3, title),
            description = COALESCE($4, description),
            brand = COALESCE($5, brand),
            model = COALESCE($6, model),
            year = COALESCE($7, year),
            condition = COALESCE($8, condition),
            price = COALESCE($9, price),
            location = COALESCE($10, location),
            images = COALESCE($11::TEXT[], images),
            updated_at = CURRENT_TIMESTAMP
         WHERE id = $1
           AND owner_id = $2
         RETURNING *`,
        [
            id,
            ownerId,
            title ?? null,
            description ?? null,
            brand ?? null,
            model ?? null,
            year == null ? null : Number(year),
            condition ?? null,
            price == null ? null : Number(price),
            location ?? null,
            images ?? null,
        ]
    );

    return result.rows[0] || null;
};

// 6. Delete a listing (owner only)
export const deleteListing = async (id, ownerId) => {
    const result = await pool.query(
        `DELETE FROM listings
         WHERE id = $1
           AND owner_id = $2
         RETURNING *`,
        [id, ownerId]
    );

    return result.rows[0] || null;
};
