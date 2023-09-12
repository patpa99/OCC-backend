const mariadb = require('mariadb');

const pool = mariadb.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  connectionLimit: 5
});


// Connection and error checking
pool.getConnection((err, connection) => {
  if(err){
    if (err.code === 'PROTOCOL_CONNECTION_LOST')
      console.error('The database has lost connection');
    if (err.code === 'ER_CON_COUNT_ERROR')
      console.error('The database has too many connections');
    if (err.code === 'ECONNREFUSED')
      console.error('The database connection was refused');
  }
  if(connection) connection.release();
  return;
});

module.exports = pool;