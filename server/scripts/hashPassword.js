import bcrypt from 'bcryptjs'

const password = process.argv[2] || 'Test1234'

async function hashPassword() {
  try {
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)
    console.log('\nPassword:', password)
    console.log('Hashet password:', hashedPassword)

  } catch (err) {
    console.error('Fejl:', err)
  }
}

hashPassword() 