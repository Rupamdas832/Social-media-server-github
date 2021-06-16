const mongoose = require('mongoose')

const {Schema} = mongoose;

const userSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    unique: [true, 'Email already present.']
    },
  password: {
    type: String,
    required: true,
    select: false
    },
    userName: {
      type: String,
      required: true
    },
    profileImg: {
      type: String,
    },
    coverImg: {
      type: String,
    },
    bio: {
      type: String,
    },
    website: {
      type: String,
    },
    followers:{
      type: [{
        userId: {type: mongoose.Schema.Types.ObjectId,
    ref: "User" },
        userName: String,
        profileImg: String,
        name: String 
        }]
    },
    following:{
      type: [{
        userId: {type: mongoose.Schema.Types.ObjectId,
    ref: "User" },
        userName: String,
        profileImg: String,
        name: String 
        }]
    }
},{
  timestamps: true
})

const User = mongoose.model('User', userSchema)

module.exports = {User}