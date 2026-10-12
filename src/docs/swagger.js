import swaggerJSDoc from "swagger-jsdoc";

const swaggerOptions = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Authentication API Documentation",
            version: "1.0.0",
            description: "API documentation for User Authentication & Password Management",
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
                    description: "Enter your JWT token in the format: Bearer <token>",
                },
            },
        },
    },
    apis: ["./src/modules/auth/auth.routes.js"],
};

const swaggerSpec = swaggerJSDoc(swaggerOptions);

export default swaggerSpec;

