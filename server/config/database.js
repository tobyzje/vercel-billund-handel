import mysql from 'mysql2/promise'

// Log database config (fjern passwords)
console.log('Database config:', {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  database: process.env.DB_NAME,
  hasPassword: !!process.env.DB_PASSWORD
})

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  // Tilføj SSL config for UnoEuro
  ssl: {
    rejectUnauthorized: false
  }
})

// Test forbindelsen ved startup med mere detaljeret error handling
const testConnection = async () => {
  try {
    const connection = await pool.getConnection()
    console.log('✅ Database forbindelse oprettet')
    
    // Test en simpel query
    const [result] = await connection.query('SELECT 1')
    console.log('✅ Test query successful:', result)
    
    // Test users tabel
    const [users] = await connection.query('SELECT COUNT(*) as count FROM users')
    console.log('✅ Users tabel OK, antal brugere:', users[0].count)
    
    connection.release()
  } catch (err) {
    console.error('❌ Database forbindelses fejl:', {
      code: err.code,
      errno: err.errno,
      sqlState: err.sqlState,
      sqlMessage: err.sqlMessage
    })
    // Kast fejlen videre så serveren ikke starter hvis der er database problemer
    throw err
  }
}

// Kør test ved startup
testConnection()

export default pool 