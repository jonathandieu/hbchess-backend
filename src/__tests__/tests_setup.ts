import mongoose from "mongoose";
mongoose.Promise = global.Promise;

async function removeAllCollections() {
  const collections = Object.keys(mongoose.connection.collections);
  for (const collectionName of collections) {
    const collection = mongoose.connection.collections[collectionName];
    await collection.deleteMany({});
  }
}

async function dropAllCollections() {
  const collections = Object.keys(mongoose.connection.collections);
  for (const collectionName of collections) {
    const collection = mongoose.connection.collections[collectionName];
    try {
      await collection.drop();
    } catch (error) {
      if (error instanceof Error) {
        // Sometimes this error happens, but you can safely ignore it
        if (error.message === "ns not found") return;
        // This error occurs when you use it.todo. You can
        // safely ignore this error too
        if (
          error.message.includes("a background operation is currently running")
        )
          return;
        // eslint-disable-next-line no-console
        console.log(error.message);
      }
    }
  }
}

export const setupDB = () => {
  // Connect to Mongoose
  beforeAll(async () => {
    await mongoose.connect(`${process.env.MONGO_URI_TESTING}`);
  });

  // Cleans up database between each test
  afterEach(async () => {
    await removeAllCollections();
  });

  // Disconnect Mongoose
  afterAll(async () => {
    await dropAllCollections();
    await mongoose.connection.close();
  });
};
