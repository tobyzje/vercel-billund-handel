import { Sequelize } from 'sequelize'
import pg from 'pg'

const sequelize = new Sequelize(process.env.POSTGRES_URL, {
  dialect: 'postgres',
  dialectModule: pg,
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false
    },
    keepAlive: true
  },
  pool: {
    max: 20,
    min: 0,
    acquire: 60000,
    idle: 10000
  }
})

// Test forbindelsen
sequelize.authenticate()
  .then(() => console.log('✅ Database forbindelse etableret'))
  .catch(err => console.error('❌ Database forbindelsesfejl:', err))

export default sequelize 