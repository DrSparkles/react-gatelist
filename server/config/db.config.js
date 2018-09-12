import * as dotenv from "dotenv";
dotenv.config();

const dbConfig = {
  connection: {
    host: process.env.MONGO_HOST,
    password: process.env.MONGO_PASS
  },
  test: {
    host: process.env.MONGO_HOST_TEST,
    password: process.env.MONGO_PASS_TEST
  }
};

export default dbConfig;