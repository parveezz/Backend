import pool from "../config/db.js";

const resetDatabase = async () => {
    try {
        console.log("Clearing all data and tables from database...");
        await pool.query(`
            DROP SCHEMA public CASCADE;
            CREATE SCHEMA public;
            GRANT ALL ON SCHEMA public TO postgres;
            GRANT ALL ON SCHEMA public TO public;
        `);
        console.log("All tables and data cleared successfully!");
    } catch (error) {
        console.error("Failed to clear database:", error);
        process.exit(1);
    } finally {
        await pool.end();
    }
};

resetDatabase();
