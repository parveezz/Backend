import { Router } from "express";
import {
    createListingController,
    getListingsController,
    getListingByIdController,
    updateListingController,
    deleteListingController,
    getMyListingsController,
} from "./listing.controller.js";
import {
    validateCreateListingMiddleware,
    validateUpdateListingMiddleware,
} from "./listing.middleware.js";
import { authenticate } from "../auth/auth.middleware.js";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Listings
 *   description: Boat Listings Management
 */

/**
 * @swagger
 * /listings:
 *   get:
 *     summary: Get all listings (paginated)
 *     tags: [Listings]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of items per page
 *     responses:
 *       200:
 *         description: List of boat listings
 */
router.get("/", getListingsController);

/**
 * @swagger
 * /listings/user/my-listings:
 *   get:
 *     summary: Get listings owned by the logged-in user
 *     tags: [Listings]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User listings retrieved
 *       401:
 *         description: Unauthorized
 */
router.get("/user/my-listings", authenticate, getMyListingsController);

/**
 * @swagger
 * /listings/{id}:
 *   get:
 *     summary: Get a single boat listing by ID
 *     tags: [Listings]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Listing ID
 *     responses:
 *       200:
 *         description: Listing details
 *       404:
 *         description: Listing not found
 */
router.get("/:id", getListingByIdController);

/**
 * @swagger
 * /listings:
 *   post:
 *     summary: Create a new boat listing
 *     tags: [Listings]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - description
 *               - brand
 *               - model
 *               - year
 *               - condition
 *               - price
 *               - location
 *             properties:
 *               title:
 *                 type: string
 *                 example: Sea Ray 320 Sundancer
 *               description:
 *                 type: string
 *                 example: Beautiful cruiser boat in excellent condition.
 *               brand:
 *                 type: string
 *                 example: Sea Ray
 *               model:
 *                 type: string
 *                 example: Sundancer 320
 *               year:
 *                 type: integer
 *                 example: 2021
 *               condition:
 *                 type: string
 *                 enum: [new, used, refurbished]
 *                 example: used
 *               price:
 *                 type: number
 *                 example: 85000.00
 *               location:
 *                 type: string
 *                 example: Miami, FL
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["https://example.com/boat1.jpg"]
 *     responses:
 *       201:
 *         description: Listing created successfully
 *       400:
 *         description: Validation failed
 *       401:
 *         description: Unauthorized
 */
router.post(
    "/",
    authenticate,
    validateCreateListingMiddleware,
    createListingController
);

/**
 * @swagger
 * /listings/{id}:
 *   patch:
 *     summary: Update an existing listing (Owner only)
 *     tags: [Listings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Listing ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               price:
 *                 type: number
 *               condition:
 *                 type: string
 *                 enum: [new, used, refurbished]
 *               location:
 *                 type: string
 *     responses:
 *       200:
 *         description: Listing updated successfully
 *       403:
 *         description: Not authorized to update this listing
 *       404:
 *         description: Listing not found
 */
router.patch(
    "/:id",
    authenticate,
    validateUpdateListingMiddleware,
    updateListingController
);

/**
 * @swagger
 * /listings/{id}:
 *   delete:
 *     summary: Delete a listing (Owner only)
 *     tags: [Listings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Listing ID
 *     responses:
 *       200:
 *         description: Listing deleted successfully
 *       403:
 *         description: Not authorized to delete this listing
 *       404:
 *         description: Listing not found
 */
router.delete("/:id", authenticate, deleteListingController);

export default router;