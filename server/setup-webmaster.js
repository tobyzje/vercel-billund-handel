require('dotenv').config()
const mongoose = require('mongoose')
const User = require('./models/User')

const WEBMASTER_CONFIG = {
  name: 'Tobias Stoklund',
  email: 'tobias@nationsnetwork.dk',
  password: 'Guldkorn34', // Husk at ændre dette
  role: 'webmaster'
}

async function setupWebmaster() {
  try {
    // Forbind til MongoDB
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    })
    console.log('✅ Forbundet til MongoDB')

    // Check om webmaster allerede eksisterer
    const existingUser = await User.findOne({ email: WEBMASTER_CONFIG.email })
    
    if (existingUser) {
      if (existingUser.role === 'webmaster') {
        console.log('⚠️ Webmaster konto eksisterer allerede')
      } else {
        // Opdater eksisterende bruger til webmaster
        existingUser.role = 'webmaster'
        await existingUser.save()
        console.log('✅ Eksisterende bruger opgraderet til webmaster')
      }
    } else {
      // Opret ny webmaster konto
      const webmaster = await User.createWebmaster(WEBMASTER_CONFIG)
      console.log('✅ Ny webmaster konto oprettet:', {
        name: webmaster.name,
        email: webmaster.email,
        role: webmaster.role
      })
    }

  } catch (error) {
    console.error('❌ Fejl under setup:', error)
  } finally {
    // Luk database forbindelse
    await mongoose.connection.close()
    console.log('📋 Setup afsluttet')
  }
}

// Kør setup
setupWebmaster() 