import sequelize from '../config/database.js'
import User from '../models/User.js'
import Event from '../models/Event.js'

async function initDatabase() {
  try {
    // Opret tabeller
    await sequelize.sync({ force: true }) // ADVARSEL: Dette sletter eksisterende tabeller!
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

    // Opret test event
    await Event.create({
      title: 'Test Event',
      date: new Date('2024-04-01'),
      time: '14:00',
      location: 'Billund Centrum',
      description: 'Dette er et test event',
      imageUrl: 'https://via.placeholder.com/800x400',
      imagePublicId: 'test-event',
      createdBy: webmaster.id
    })
    console.log('✅ Test event oprettet')

    console.log('✅ Database initialisering fuldført')
  } catch (error) {
    console.error('❌ Fejl under database initialisering:', error)
    process.exit(1)
  } finally {
    await sequelize.close()
  }
}

// Kør migrations
initDatabase() 