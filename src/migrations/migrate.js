import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import pool from "../config/db.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const runMigrations = async () => {
    try {
        console.log("Starting migrations...");
        const files = fs.readdirSync(__dirname)
            .filter(file => file.endsWith(".sql"))
            .sort();

        for (const file of files) {
            console.log(`Applying migration: ${file}...`);
            const filePath = path.join(__dirname, file);
            const sql = fs.readFileSync(filePath, "utf-8");
            await pool.query(sql);
            console.log(`Applied: ${file}`);
        }

        console.log("All migrations completed successfully!");
    } catch (error) {
        console.error("Migration failed:", error);
        process.exit(1);
    } finally {
        await pool.end();
    }
};

runMigrations();
