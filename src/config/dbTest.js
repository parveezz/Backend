import db from "./db.js";

const dbTest = async () => {
    try {
        const result = await db.query("SELECT NOW()");
        console.log("Database connection successful:", result.rows[0]);
    } catch (error) {
        console.error("Database connection failed:", error);
    }
};

export default dbTest;