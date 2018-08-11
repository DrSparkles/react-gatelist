console.log('dbConfig process', process.env);
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