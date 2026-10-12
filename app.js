import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import swaggerUi from "swagger-ui-express";
import swaggerSpec from "./src/docs/swagger.js";
import authRoutes from "./src/modules/auth/auth.routes.js";
import listingRoutes from "./src/modules/Listings/listing.routes.js";

const app = express();

// Security Headers
app.use(
    helmet({
        contentSecurityPolicy: false,
    })
);

// HTTP Request Logger
app.use(morgan("dev"));

// Cross-Origin Resource Sharing (CORS) for Frontend
app.use(
    cors({
        origin: "http://localhost:5173",
        credentials: true,
        methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
        allowedHeaders: ["Content-Type", "Authorization"],
    })
);

// Rate Limiting (e.g. 100 requests per 15 minutes per IP)
const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 1000,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        success: false,
        message: "Too many requests from this IP, please try again after 15 minutes.",
    },
});
app.use(apiLimiter);

// Body Parsing Middlewares (supporting json & extended form/file data)
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

// Static files (for uploads / public assets)
app.use(express.static("public"));

// Health Check
app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "Practise Backend is running",
    });
});

// Swagger API Documentation
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Module Routes
app.use("/auth", authRoutes);
app.use("/listings", listingRoutes);

// 404 Not Found Handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: `Route ${req.originalUrl} not found`,
    });
});

// Global Error Handler
app.use((err, req, res, next) => {
    console.error("Unhandled Error:", err);
    res.status(err.status || 500).json({
        success: false,
        message: err.message || "Internal Server Error",
    });
});

export default app;
