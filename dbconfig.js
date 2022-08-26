const { Pool } = require('pg');

const pool = new Pool({
    user: "postgres",
    password: '111TyT111',
    host: "localhost",
    port: 5432,
    database: 'commercedb'
});

module.exports = pool;