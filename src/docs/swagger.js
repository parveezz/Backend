import swaggerJSDoc from "swagger-jsdoc";

const swaggerOptions = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Boat Marketplace & Auth API Documentation",
            version: "1.0.0",
            description: "Complete API specification for User Authentication and Boat Listings with relational data",
        },
        servers: [
            {
                url: "http://localhost:3000",
                description: "Local Development Server",
            },
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: "http",
                    scheme: "bearer",
                    bearerFormat: "JWT",
                    description: "Enter your JWT token: Bearer <token>",
                },
            },
            schemas: {
                User: {
                    type: "object",
                    properties: {
                        id: { type: "integer", example: 1 },
                        name: { type: "string", example: "John Doe" },
                        email: { type: "string", format: "email", example: "john@example.com" },
                        email_verified: { type: "boolean", example: false },
                        created_at: { type: "string", format: "date-time" },
                    },
                },
                Listing: {
                    type: "object",
                    properties: {
                        id: { type: "integer", example: 1 },
                        title: { type: "string", example: "Sea Ray 320 Sundancer" },
                        description: { type: "string", example: "Cruiser boat in mint condition." },
                        brand: { type: "string", example: "Sea Ray" },
                        model: { type: "string", example: "Sundancer 320" },
                        year: { type: "integer", example: 2021 },
                        condition: { type: "string", enum: ["new", "used", "refurbished"], example: "used" },
                        price: { type: "number", example: 85000.00 },
                        location: { type: "string", example: "Miami, FL" },
                        images: {
                            type: "array",
                            items: { type: "string" },
                            example: ["https://images.unsplash.com/boat.jpg"],
                        },
                        owner_id: {
                            type: "integer",
                            description: "User ID of the seller",
                            example: 1,
                        },
                        seller_id: {
                            type: "integer",
                            description: "User ID of the seller",
                            example: 1,
                        },
                        seller_name: {
                            type: "string",
                            description: "Full name of the seller",
                            example: "John Doe",
                        },
                        seller_email: {
                            type: "string",
                            description: "Contact email of the seller",
                            example: "john@example.com",
                        },
                        created_at: { type: "string", format: "date-time" },
                        updated_at: { type: "string", format: "date-time" },
                    },
                },
            },
        },
    },
    apis: [
        "./src/modules/auth/auth.routes.js",
        "./src/modules/Listings/listing.routes.js",
    ],
};

const swaggerSpec = swaggerJSDoc(swaggerOptions);

export default swaggerSpec;
