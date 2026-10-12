import dotenv from "dotenv";
import app from "./app.js";
import dbTest from "./src/config/dbTest.js";

dotenv.config();

const port = process.env.PORT;

app.listen(port, () => {
    dbTest();
    console.log(`Server: http://localhost:${port}`);
});