import { Model, DataTypes } from 'sequelize'
import bcrypt from 'bcryptjs'
import sequelize from '../config/database.js'

class User extends Model {
  static async hashPassword(password) {
    const salt = await bcrypt.genSalt(10)
    return bcrypt.hash(password, salt)
  }

  async comparePassword(candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password)
  }
}

User.init({
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: [2, 50]
    }
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true
    }
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  role: {
    type: DataTypes.ENUM('user', 'admin', 'webmaster'),
    defaultValue: 'user'
  },
  active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  lastLogin: {
    type: DataTypes.DATE
  }
}, {
  sequelize,
  modelName: 'User',
  tableName: 'users',
  timestamps: true,
  underscored: true
})

User.beforeCreate(async (user) => {
  user.password = await User.hashPassword(user.password)
})

User.beforeUpdate(async (user) => {
  if (user.changed('password')) {
    user.password = await User.hashPassword(user.password)
  }
})

export default User 