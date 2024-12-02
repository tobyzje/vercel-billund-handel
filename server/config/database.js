import mysql from 'mysql2/promise'

const config = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  ssl: false
}

console.log('Database config (uden password):', {
  ...config,
  password: '********'
})

const pool = mysql.createPool(config)

// Test forbindelsen ved startup
const testConnection = async () => {
  let connection
  try {
    console.log('Forsøger at forbinde til database...')
    connection = await pool.getConnection()
    console.log('✅ Database forbindelse oprettet')
    
    const [result] = await connection.query('SELECT 1')
    console.log('✅ Test query successful')
    
  } catch (err) {
    console.error('❌ Database forbindelses fejl:', {
      message: err.message,
      code: err.code,
      errno: err.errno,
      sqlState: err.sqlState,
      sqlMessage: err.sqlMessage,
      host: config.host,
      user: config.user,
      database: config.database,
      port: config.port
    })
    throw err
  } finally {
    if (connection) {
      connection.release()
    }
  }
}

// Kør test ved startup
testConnection()
  .catch(err => {
    console.error('Fatal database error:', err.message)
    process.exit(1)
  })

export default pool 