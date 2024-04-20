const express = require('express');
const bodyParser = require('body-parser');
require('dotenv').config();
const { setupDb } = require('./setup/mongoose');

const app = express();

app.use(bodyParser.urlencoded());
app.use(bodyParser.json());

const setup = async () => {

  await setupDb(process.env.MONGO_DB_URI);

  // app.use(Middleware.authorization);

  app.listen(process.env.PORT, () => {
    console.log(`server started port: ${process.env.PORT} baseUrl: ${process.env.BASE_URL}`);
  });
};

setup();
