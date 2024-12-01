const router = require('express').Router()
const Event = require('../models/Event')
const auth = require('../middleware/auth')
const { upload, cloudinary } = require('../config/cloudinary')

// Tilføj denne test route øverst i filen
router.get('/test-cloudinary', async (req, res) => {
  try {
    // Test Cloudinary forbindelse
    const result = await cloudinary.api.ping()
    res.json({ 
      message: 'Cloudinary forbindelse OK',
      status: result
    })
  } catch (error) {
    console.error('Cloudinary test fejl:', error)
    res.status(500).json({ 
      message: 'Cloudinary forbindelse fejlede',
      error: error.message 
    })
  }
})

// Opret event med billede
router.post('/create', auth, upload.single('image'), async (req, res) => {
  try {
    const { title, date, time, location, description } = req.body

    if (!req.file) {
      return res.status(400).json({ message: 'Billede er påkrævet' })
    }

    const event = new Event({
      title,
      date,
      time,
      location,
      description,
      imageUrl: req.file.path,
      imagePublicId: req.file.filename,
      createdBy: req.userId
    })

    await event.save()

    res.status(201).json({
      message: 'Event oprettet succesfuldt',
      event
    })
  } catch (error) {
    // Hvis der sker en fejl, slet det uploadede billede
    if (req.file?.path) {
      await cloudinary.uploader.destroy(req.file.filename)
    }
    console.error('Event oprettelse fejl:', error)
    res.status(500).json({ message: 'Kunne ikke oprette event' })
  }
})

// Hent alle events
router.get('/', async (req, res) => {
  try {
    const events = await Event.find()
      .sort({ date: 1 })
      .populate('createdBy', 'name')
    
    res.json(events)
  } catch (error) {
    console.error('Hent events fejl:', error)
    res.status(500).json({ message: 'Kunne ikke hente events' })
  }
})

// Slet event
router.delete('/:id', auth, async (req, res) => {
  try {
    const event = await Event.findById(req.eventId)
    if (!event) {
      return res.status(404).json({ message: 'Event ikke fundet' })
    }

    // Slet billede fra Cloudinary
    if (event.imagePublicId) {
      await cloudinary.uploader.destroy(event.imagePublicId)
    }

    await event.remove()
    res.json({ message: 'Event slettet' })
  } catch (error) {
    console.error('Slet event fejl:', error)
    res.status(500).json({ message: 'Kunne ikke slette event' })
  }
})

module.exports = router 