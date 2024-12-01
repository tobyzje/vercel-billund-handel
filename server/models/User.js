const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Navn er påkrævet'],
    trim: true,
    minlength: [2, 'Navn skal være mindst 2 tegn'],
    maxlength: [50, 'Navn må højst være 50 tegn']
  },
  email: {
    type: String,
    required: [true, 'Email er påkrævet'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Ugyldig email adresse']
  },
  password: {
    type: String,
    required: [true, 'Adgangskode er påkrævet'],
    minlength: [6, 'Adgangskode skal være mindst 6 tegn']
  },
  role: {
    type: String,
    enum: ['user', 'admin', 'webmaster'],
    default: 'user'
  },
  lastLogin: {
    type: Date,
    default: null
  },
  active: {
    type: Boolean,
    default: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  }
}, {
  timestamps: true
})

// Password hashing
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next()
  
  try {
    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt)
    next()
  } catch (error) {
    next(error)
  }
})

// Password verification
userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password)
}

// Admin creation
userSchema.statics.createAdmin = async function(userData, createdBy) {
  const user = new this({
    ...userData,
    role: 'admin',
    active: true,
    createdBy
  })
  return user.save()
}

// Webmaster creation
userSchema.statics.createWebmaster = async function(userData) {
  const user = new this({
    ...userData,
    role: 'webmaster',
    active: true
  })
  return user.save()
}

// Instance method to update last login
userSchema.methods.updateLastLogin = function() {
  this.lastLogin = new Date()
  return this.save()
}

module.exports = mongoose.model('User', userSchema) 