const mongoose = require("mongoose")

const {Schema} = mongoose

const postSchema = new Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User"
  },
  userName: {
    type: String,
    required: true
  },
  profileImg: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  likes: [{
    userName: String,
  }],
  comments: [{
    userName: String,
    name: String,
    profileImg: String,
    text: String,
    createdAt: Date
  }],
  reposts: [{
    userName: String,
    name: String,
    profileImg: String
  }]
},{
  timestamps: true
})

const Post = mongoose.model("Post", postSchema)

module.exports = {Post}