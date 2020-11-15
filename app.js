const serverless = require('serverless-http');
const express = require('express');
const dynamoose = require("dynamoose");
const config = require('dotenv').config();
const cors = require('cors');
const routes = require('./Routes/Routes.js');

const app = express();
const port = 3000;

const ddb = new dynamoose.aws.sdk.DynamoDB({
    "accessKeyId": process.env.AK_ID,
    "secretAccessKey": process.env.SA_KEY,
    "region": process.env.REGION__
});

dynamoose.aws.ddb.set(ddb);

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use('/', routes);

app.listen(port, () => {
  console.log(`listening at http://localhost:${port}`)
});

// module.exports.handler = serverless(app);
