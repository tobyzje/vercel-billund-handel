import { Sequelize } from 'sequelize'
import 'dotenv/config'

const sequelize = new Sequelize({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  dialect: 'mysql',
  dialectOptions: {
    connectTimeout: 60000,
    ssl: null,
    supportBigNumbers: true,
    bigNumberStrings: true
  },
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  },
  logging: true
})

// Test forbindelsen før export
async function testConnection() {
  try {
    await sequelize.authenticate()
    console.log('✅ Database forbindelse testet og OK')
    
    // Log connection info for debugging
    console.log('Database connection info:', {
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      database: process.env.DB_NAME,
      user: process.env.DB_USER
    })
  } catch (error) {
    console.error('❌ Kunne ikke forbinde til databasen:', error.original || error)
    throw error
  }
}

// Kør test men lad fejl propagere
testConnection().catch(console.error)

export default sequelize 