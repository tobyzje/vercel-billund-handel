import { Sequelize } from 'sequelize'

const sequelize = new Sequelize({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  dialect: 'mysql',
  dialectOptions: {
    connectTimeout: 60000,
    // SSL konfiguration hvis nødvendigt
    ssl: {
      rejectUnauthorized: false
    }
  },
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  },
  retry: {
    match: [
      /Deadlock/i,
      /SequelizeConnectionError/,
      /SequelizeConnectionRefusedError/,
      /SequelizeHostNotFoundError/,
      /SequelizeHostNotReachableError/,
      /SequelizeInvalidConnectionError/,
      /SequelizeConnectionTimedOutError/,
      /TimeoutError/
    ],
    max: 3
  },
  logging: process.env.NODE_ENV === 'development' ? console.log : false
})

// Test forbindelsen før export
async function testConnection() {
  try {
    await sequelize.authenticate()
    console.log('✅ Database forbindelse testet og OK')
  } catch (error) {
    console.error('❌ Kunne ikke forbinde til databasen:', error)
    throw error
  }
}

testConnection()

export default sequelize 