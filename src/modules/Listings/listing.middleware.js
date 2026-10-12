import {
    validateCreateListing,
    validateUpdateListing,
} from "./listing.validation.js";

/**
 * Middleware: Validates request body when creating a listing
 */
export const validateCreateListingMiddleware = (req, res, next) => {
    const errors = validateCreateListing(req.body);

    if (errors.length > 0) {
        return res.status(400).json({
            success: false,
            message: "Validation failed.",
            errors,
        });
    }

    next();
};

/**
 * Middleware: Validates request body when updating a listing
 */
export const validateUpdateListingMiddleware = (req, res, next) => {
    // If request body is empty
    if (!req.body || Object.keys(req.body).length === 0) {
        return res.status(400).json({
            success: false,
            message: "At least one field is required to update.",
        });
    }

    const errors = validateUpdateListing(req.body);

    if (errors.length > 0) {
        return res.status(400).json({
            success: false,
            message: "Validation failed.",
            errors,
        });
    }

    next();
};
