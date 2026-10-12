import * as listingRepository from "./listing.repository.js";

/**
 * 1. Create a new boat listing
 */
export const createListingService = async (data) => {
    return await listingRepository.createListing(data);
};

/**
 * 2. Get all listings with pagination
 */
export const getAllListingsService = async (page = 1, limit = 10) => {
    const pageNumber = Math.max(1, parseInt(page, 10) || 1);
    const limitNumber = Math.min(100, Math.max(1, parseInt(limit, 10) || 10));
    const offset = (pageNumber - 1) * limitNumber;

    const [listings, total] = await Promise.all([
        listingRepository.getAllListings(limitNumber, offset),
        listingRepository.countListings(),
    ]);

    return {
        listings,
        pagination: {
            total,
            page: pageNumber,
            limit: limitNumber,
            totalPages: Math.ceil(total / limitNumber),
        },
    };
};

/**
 * 3. Get single listing by ID
 */
export const getListingByIdService = async (id) => {
    const listingId = parseInt(id, 10);
    if (!Number.isInteger(listingId) || listingId <= 0) {
        const error = new Error("Invalid listing ID format.");
        error.statusCode = 400;
        throw error;
    }

    const listing = await listingRepository.getListingById(listingId);
    if (!listing) {
        const error = new Error("Listing not found.");
        error.statusCode = 404;
        throw error;
    }

    return listing;
};

/**
 * 4. Get listings owned by current user
 */
export const getMyListingsService = async (ownerId) => {
    return await listingRepository.getMyListings(ownerId);
};

/**
 * 5. Update a listing (owner check)
 */
export const updateListingService = async (id, ownerId, data) => {
    const listingId = parseInt(id, 10);
    if (!Number.isInteger(listingId) || listingId <= 0) {
        const error = new Error("Invalid listing ID format.");
        error.statusCode = 400;
        throw error;
    }

    // Verify existing listing
    const existingListing = await listingRepository.getListingById(listingId);
    if (!existingListing) {
        const error = new Error("Listing not found.");
        error.statusCode = 404;
        throw error;
    }

    // Check ownership
    if (existingListing.owner_id !== ownerId) {
        const error = new Error("You are not authorized to update this listing.");
        error.statusCode = 403;
        throw error;
    }

    const updated = await listingRepository.updateListing(listingId, ownerId, data);
    return updated;
};

/**
 * 6. Delete a listing (owner check)
 */
export const deleteListingService = async (id, ownerId) => {
    const listingId = parseInt(id, 10);
    if (!Number.isInteger(listingId) || listingId <= 0) {
        const error = new Error("Invalid listing ID format.");
        error.statusCode = 400;
        throw error;
    }

    // Verify existing listing
    const existingListing = await listingRepository.getListingById(listingId);
    if (!existingListing) {
        const error = new Error("Listing not found.");
        error.statusCode = 404;
        throw error;
    }

    // Check ownership
    if (existingListing.owner_id !== ownerId) {
        const error = new Error("You are not authorized to delete this listing.");
        error.statusCode = 403;
        throw error;
    }

    return await listingRepository.deleteListing(listingId, ownerId);
};