const cloudinary = require('cloudinary').v2
const { CloudinaryStorage } = require('multer-storage-cloudinary')
const multer = require('multer')

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
})

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'billund-events',
    allowed_formats: ['jpg', 'png', 'jpeg'],
    transformation: [
      { width: 1200, height: 1200, crop: 'limit' },
      { width: 300, height: 300, crop: 'fill', gravity: 'auto' }
    ],
    format: 'jpg',
    resource_type: 'auto'
  }
})

const upload = multer({ storage: storage })

module.exports = { upload, cloudinary } 