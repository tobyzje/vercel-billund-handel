import sequelize from './config/database.js'
import User from './models/User.js'

async function setup() {
  try {
    await sequelize.sync({ force: true })
    
    const webmaster = await User.create({
      name: 'Tobias Stoklund',
      email: 'tobias@nationsnetwork.dk',
      password: 'Guldkorn34',
      role: 'webmaster'
    })

    console.log('✅ Webmaster bruger oprettet:', webmaster.email)
  } catch (error) {
    console.error('Setup fejl:', error)
  } finally {
    await sequelize.close()
  }
}

setup() 