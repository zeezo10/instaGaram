const { MongoClient, ServerApiVersion } = require("mongodb");
require("dotenv").config();
const uri = process.env.DATABASE_URL;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true ,
    deprecationErrors: true,
  },
});

const dbName = "instagram";

const db = client.db(dbName);

module.exports = {
  db
};
