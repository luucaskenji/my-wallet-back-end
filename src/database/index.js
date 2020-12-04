require('dotenv').config();
const { Pool } = require('pg');

const connectionToDB = new Pool({
    connectionString: process.env.DATABASE_URL
});

module.exports = { connectionToDB };