import mongoose from "mongoose";

/**
 *  @summary  Connect to the MongoDB database.
 *  @param {string} DB_PWD - The Password for the database.
 */
export const connectToDatabase = (DB_PWD: string) => {
  if (DB_PWD !== undefined) {
    // Replace "<PASSWORD>" placeholder in the DATABASE string with the actual password
    const DB = process.env.DATABASE?.replace("<PASSWORD>", DB_PWD) as string;

    // Connect to the MongoDB database
    mongoose.connect(DB).then(() => console.log("DB connection successfull!"));
  } else {
    // Log a message if the database password is undefined
    console.log(`DB_PASSWORD is undefined!`);
  }
};
