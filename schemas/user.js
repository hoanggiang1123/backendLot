const mongoose = require('mongoose')
const crypto = require('crypto');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    max: 32
  },
  name: {
    type: String,
    trim: true,
    max: 32
  },
  email: {
    type: String,
    trim: true,
    required: true,
    unique: true,
    lowercase: true
  },
  hassed_password: {
    type: String,
    required: true
  },
  salt: String,
  about: {
    type: String,
    default: ''
  },
  role: {
    type: Number,
    default: 0
  },
  avatar: {
    type: String,
    default: ''
  },
  status: {
    type: String,
    default: 'active'
  },
  phone: {
    type: String,
    default: ''
  },
  resetPasswordLink: {
    type: String,
    default: ''
  }
}, { timestamps: true });

userSchema
  .virtual('password')
  .set(function(password) {
    this._password = password;
    this.salt = this.makeSalt();

    this.hassed_password = this.encryptPassword(password)
  })
  .get(function() {
    return this._password;
  })

userSchema.methods = {
  authenticate: function(password) {
    return this.encryptPassword(password) === this.hassed_password
  },

  encryptPassword: function(password) {
    if (!password) return '';
    try {
      return crypto
        .createHmac('sha1', this.salt)
        .update(password)
        .digest('hex');
    } catch (error) {
      return '';
    }
  },
  makeSalt: function() {
    return Math.round(new Date().valueOf() * Math.random()) + '';
  },
  updatePassword: function (password) {
    this.hassed_password = this.encryptPassword(password)
  }
}
module.exports = mongoose.model('User', userSchema);
