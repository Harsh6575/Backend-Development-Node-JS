import dotenv from "dotenv";
// import 'dotenv/config'
import { app } from "./app.js";
import connectDB from "./db/index.js";

dotenv.config({
  path: "./.env",
});

// set up port number
const PORT = process.env.PORT ?? 3000;

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on port http://localhost:${PORT}/`);
    });
  })
  .catch((error) => {
    console.error("Error connecting to the database:", error);
    process.exit(1); // Exit with an error code if the connection fails.
  });
