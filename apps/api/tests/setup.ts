import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';

let mongoServer: MongoMemoryServer;

// Set environment configurations prior to configuration files loading
process.env.NODE_ENV = 'test';
process.env.PORT = '5002';
process.env.MONGO_URI = 'mongodb://127.0.0.1:27017/test-temp';
process.env.JWT_SECRET = 'mock-secret-for-testing-purposes-only-123456';
process.env.JWT_EXPIRES_IN = '1h';

beforeAll(async () => {
  try {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    process.env.MONGO_URI = uri;
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(uri);
    }
  } catch (error) {
    console.warn('Failed to start MongoMemoryServer, falling back to local test DB:', error);
    const localUri = 'mongodb://127.0.0.1:27017/blog-test-suite';
    process.env.MONGO_URI = localUri;
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(localUri);
    }
  }
});

afterEach(async () => {
  if (mongoose.connection.readyState >= 1) {
    const collections = mongoose.connection.collections;
    for (const key in collections) {
      await collections[key].deleteMany({});
    }
  }
});

afterAll(async () => {
  if (mongoose.connection.readyState >= 1) {
    await mongoose.disconnect();
  }
  if (mongoServer) {
    try {
      await mongoServer.stop();
    } catch (e) {
      // Ignored
    }
  }
});
