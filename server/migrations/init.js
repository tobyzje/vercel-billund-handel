import sequelize from '../config/database.js'
import User from '../models/User.js'
import Event from '../models/Event.js'

async function initDatabase() {
  try {
    // Opret tabeller
    await sequelize.sync({ force: true })
    console.log('✅ Database tabeller oprettet')

    // Opret webmaster bruger
    const webmaster = await User.create({
      name: 'Tobias Stoklund',
      email: 'tobias@nationsnetwork.dk',
      password: 'Guldkorn34',
      role: 'webmaster',
      active: true
    })
    console.log('✅ Webmaster bruger oprettet:', webmaster.email)

    console.log('✅ Database initialisering fuldført')
  } catch (error) {
    console.error('❌ Fejl under database initialisering:', error)
  } finally {
    await sequelize.close()
  }
}

initDatabase() 