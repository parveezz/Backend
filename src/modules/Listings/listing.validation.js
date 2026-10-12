/**
 * Validation rules for creating a boat listing.
 * @param {Object} data - req.body
 * @returns {Array<string>} - Array of error messages
 */
export const validateCreateListing = (data) => {
    const errors = [];
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

    // Title
    if (!title || typeof title !== "string" || !title.trim()) {
        errors.push("Title is required.");
    } else if (title.trim().length > 100) {
        errors.push("Title cannot exceed 100 characters.");
    }

    // Description
    if (!description || typeof description !== "string" || !description.trim()) {
        errors.push("Description is required.");
    }

    // Brand
    if (!brand || typeof brand !== "string" || !brand.trim()) {
        errors.push("Brand is required.");
    } else if (brand.trim().length > 100) {
        errors.push("Brand cannot exceed 100 characters.");
    }

    // Model
    if (!model || typeof model !== "string" || !model.trim()) {
        errors.push("Model is required.");
    } else if (model.trim().length > 100) {
        errors.push("Model cannot exceed 100 characters.");
    }

    // Year
    const currentYear = new Date().getFullYear();
    const parsedYear = Number(year);
    if (year === undefined || year === null || year === "" || !Number.isInteger(parsedYear)) {
        errors.push("A valid manufacturing year is required.");
    } else if (parsedYear < 1900 || parsedYear > currentYear + 1) {
        errors.push(`Year must be between 1900 and ${currentYear + 1}.`);
    }

    // Condition
    const validConditions = ["new", "used", "refurbished"];
    if (!condition || typeof condition !== "string" || !condition.trim()) {
        errors.push("Condition is required.");
    } else if (!validConditions.includes(condition.trim().toLowerCase())) {
        errors.push("Condition must be one of: new, used, refurbished.");
    }

    // Price
    const parsedPrice = Number(price);
    if (price === undefined || price === null || price === "" || !Number.isFinite(parsedPrice)) {
        errors.push("Price is required and must be a valid number.");
    } else if (parsedPrice < 0) {
        errors.push("Price cannot be negative.");
    }

    // Location
    if (!location || typeof location !== "string" || !location.trim()) {
        errors.push("Location is required.");
    } else if (location.trim().length > 100) {
        errors.push("Location cannot exceed 100 characters.");
    }

    // Images (optional on create, but if passed must be array of strings)
    if (images !== undefined) {
        if (!Array.isArray(images) || !images.every((img) => typeof img === "string")) {
            errors.push("Images must be an array of image URL strings.");
        }
    }

    return errors;
};

/**
 * Validation rules for updating a boat listing (all fields optional).
 * @param {Object} data - req.body
 * @returns {Array<string>} - Array of error messages
 */
export const validateUpdateListing = (data) => {
    const errors = [];
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

    if (title !== undefined) {
        if (typeof title !== "string" || !title.trim()) {
            errors.push("Title cannot be empty.");
        } else if (title.trim().length > 100) {
            errors.push("Title cannot exceed 100 characters.");
        }
    }

    if (description !== undefined && (typeof description !== "string" || !description.trim())) {
        errors.push("Description cannot be empty.");
    }

    if (brand !== undefined) {
        if (typeof brand !== "string" || !brand.trim()) {
            errors.push("Brand cannot be empty.");
        } else if (brand.trim().length > 100) {
            errors.push("Brand cannot exceed 100 characters.");
        }
    }

    if (model !== undefined) {
        if (typeof model !== "string" || !model.trim()) {
            errors.push("Model cannot be empty.");
        } else if (model.trim().length > 100) {
            errors.push("Model cannot exceed 100 characters.");
        }
    }

    if (year !== undefined) {
        const currentYear = new Date().getFullYear();
        const parsedYear = Number(year);
        if (!Number.isInteger(parsedYear) || parsedYear < 1900 || parsedYear > currentYear + 1) {
            errors.push(`Year must be a valid integer between 1900 and ${currentYear + 1}.`);
        }
    }

    if (condition !== undefined) {
        const validConditions = ["new", "used", "refurbished"];
        if (typeof condition !== "string" || !validConditions.includes(condition.trim().toLowerCase())) {
            errors.push("Condition must be one of: new, used, refurbished.");
        }
    }

    if (price !== undefined) {
        const parsedPrice = Number(price);
        if (!Number.isFinite(parsedPrice) || parsedPrice < 0) {
            errors.push("Price must be a valid positive number.");
        }
    }

    if (location !== undefined) {
        if (typeof location !== "string" || !location.trim()) {
            errors.push("Location cannot be empty.");
        } else if (location.trim().length > 100) {
            errors.push("Location cannot exceed 100 characters.");
        }
    }

    if (images !== undefined) {
        if (!Array.isArray(images) || !images.every((img) => typeof img === "string")) {
            errors.push("Images must be an array of image URL strings.");
        }
    }

    return errors;
};