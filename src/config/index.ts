import { config } from "dotenv";
import path from "path";

config({ path: path.join(__dirname, "./../../.env") });

export const { DATABASE_PASSWORD, PORT } = process.env;
