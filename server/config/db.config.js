
const dbConfig = {
  test: {
    connection: 'localhost:27017/gatelist_test'
  },
  development: {
    connection: 'localhost:27017/gatelist_dev'
  },
  production: {
    connection: 'localhost:27017/gatelist'
  }
};

/**
 * Default to development server, and set up other environments for export
 */
let config = dbConfig.development;
if (process.env.NODE_ENV === 'development'){
  config = dbConfig.development;
}
else if (process.env.NODE_ENV === 'production'){
  config = dbConfig.production;
}
else if (process.env.NODE_ENV === 'test'){
  config = dbConfig.test;
}


export default config;