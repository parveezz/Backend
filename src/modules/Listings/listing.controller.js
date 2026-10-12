import {
    createListingService,
    getAllListingsService,
    getListingByIdService,
    getMyListingsService,
    updateListingService,
    deleteListingService,
} from "./listing.service.js";

/**
 * 1. Create a listing
 * POST /listings
 */
export const createListingController = async (req, res, next) => {
    try {
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
        } = req.body;

        const listing = await createListingService({
            title: title.trim(),
            description: description.trim(),
            brand: brand.trim(),
            model: model.trim(),
            year: Number(year),
            condition: condition.trim().toLowerCase(),
            price: Number(price),
            location: location.trim(),
            images,
            ownerId: req.user.id,
        });

        return res.status(201).json({
            success: true,
            message: "Boat listing created successfully.",
            data: { listing },
        });
    } catch (error) {
        next(error);
    }
};

/**
 * 2. Get all listings with pagination
 * GET /listings?page=1&limit=10
 */
export const getListingsController = async (req, res, next) => {
    try {
        const { page = 1, limit = 10 } = req.query;
        const result = await getAllListingsService(page, limit);

        return res.status(200).json({
            success: true,
            data: result,
        });
    } catch (error) {
        next(error);
    }
};

/**
 * 3. Get single listing by ID
 * GET /listings/:id
 */
export const getListingByIdController = async (req, res, next) => {
    try {
        const { id } = req.params;
        const listing = await getListingByIdService(id);

        return res.status(200).json({
            success: true,
            data: { listing },
        });
    } catch (error) {
        next(error);
    }
};

/**
 * 4. Get current user's listings
 * GET /listings/my-listings
 */
export const getMyListingsController = async (req, res, next) => {
    try {
        const listings = await getMyListingsService(req.user.id);

        return res.status(200).json({
            success: true,
            data: { listings },
        });
    } catch (error) {
        next(error);
    }
};

/**
 * 5. Update a listing (owner only)
 * PATCH /listings/:id
 */
export const updateListingController = async (req, res, next) => {
    try {
        const { id } = req.params;
        const updated = await updateListingService(id, req.user.id, req.body);

        return res.status(200).json({
            success: true,
            message: "Listing updated successfully.",
            data: { listing: updated },
        });
    } catch (error) {
        next(error);
    }
};

/**
 * 6. Delete a listing (owner only)
 * DELETE /listings/:id
 */
export const deleteListingController = async (req, res, next) => {
    try {
        const { id } = req.params;
        await deleteListingService(id, req.user.id);

        return res.status(200).json({
            success: true,
            message: "Listing deleted successfully.",
        });
    } catch (error) {
        next(error);
    }
};