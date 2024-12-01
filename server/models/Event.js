const mongoose = require('mongoose')

const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Titel er påkrævet'],
    trim: true
  },
  date: {
    type: Date,
    required: [true, 'Dato er påkrævet']
  },
  time: {
    type: String,
    required: [true, 'Tidspunkt er påkrævet']
  },
  location: {
    type: String,
    required: [true, 'Lokation er påkrævet'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Beskrivelse er påkrævet'],
    trim: true
  },
  imageUrl: {
    type: String,
    required: [true, 'Billede er påkrævet']
  },
  imagePublicId: {
    type: String,
    required: true
  },
  imageThumbnail: {
    type: String
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
})

module.exports = mongoose.model('Event', eventSchema) 