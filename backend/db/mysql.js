const mysql = require('mysql2')

const connectWithRetry = () => {
  const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    port: process.env.DB_PORT || 3306,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    maxIdle: 10,
    idleTimeout: 60000,
    queueLimit: 0,
    enableKeepAlive: true,
    keepAliveInitialDelay: 0
  })

  pool.on('error', function(err) {
    console.error('MySQL Pool Error:', err)
    setTimeout(connectWithRetry, 2000)
  })

  return pool
}

const pool = connectWithRetry()

module.exports = pool
