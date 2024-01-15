import { DATABASE_PASSWORD, PORT } from "./config";

import app from "./app";
import { connectToDatabase } from "./utils/database.util";

// Call the function with the provided database password
connectToDatabase(DATABASE_PASSWORD as string);

/**
 *  Starts the server on the specfied port.
 *
 *  @param {number} - The port number on the server should listen.
 *  @param {Function} - The callback function to be executed when the server is running.
 */
app.listen(PORT, () => {
  console.log(`server is running on port ${PORT}`);
});
