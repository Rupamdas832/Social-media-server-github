const { Post } = require("./posts.model.js")

const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find({})
    if (!posts) {
      return res.status(404).json({ success: false, message: "No posts found. Sorry!" })
    }
    res.status(200).json({ success: true, posts: posts })
  } catch (error) {
    console.log(error)
    res.status(500).json({ success: false, message: "Couldn't retrieve data. Sorry!" })
  }
}

const addPost = async (req, res) => {
  const {userName,name,profileImg,content} = req.body;
  const {userId} = req

  try {
    const newPost = new Post({
          userId,
          userName,
          name,
          profileImg,
          content,
          likes: [],
          comments: [],
          reposts: []
        }) 
    const savePost = await newPost.save()
    res.status(201).json({ success: true, post: savePost })
  } catch (error) {
    console.log(error)
    res.status(500).json({ success: false, message: "Couldn't compose post. Sorry!" })
  }
}

const findPostById = async (req,res,next,postId) => {
  try{
const foundPost = await Post.findById(postId)
  if(!foundPost){
      return res.status(404).json({ success: false, message: "Post not found. Sorry!" }) 
    }
    req.post = foundPost
    next();
  }catch(error){
    console.log(error)
    res.status(500).json({ success: false, message: "Something went wrong. Sorry!" })
  }
  
}

const updateLike = async (req,res) => {
  const {userName} = req.body;
  const {post} = req
  try{
    post.likes.push({userName: userName})
    post.save()
    res.status(201).json({ success: true, post: post })
  }catch(error){
    console.log(error)
    res.status(500).json({ success: false, message: "Couldn't retrieve data. Sorry!" })
  }
}

const removeLike = async (req,res) => {
  const {userName} = req.body;
  const {post} = req
  try{
    post.likes = post.likes.filter(item => item.userName !== userName)
    post.save()
    res.status(200).json({ success: true, post: post })
  }catch(error){
    console.log(error)
    res.status(500).json({ success: false, message: "Couldn't retrieve data. Sorry!" })
  }
}

const addComment = async (req,res) => {
  const {userName,name,profileImg,text} = req.body;
  const {post} = req
  try{
    post.comments.push({
      userName,
      name,
      profileImg,
      text,
      createdAt: new Date().toISOString()
      })
    post.save()
    res.status(201).json({ success: true, post: post })
  }catch(error){
    console.log(error)
    res.status(500).json({ success: false, message: "Couldn't retrieve data. Sorry!" })
  }
}

const removeComment = async (req,res) => {
  const {commentId} = req.body;
  const {post} = req
  try{
    const foundComment = post.comments.find(item => item._id ==  commentId)
    if(!foundComment){
      return res.status(404).json({ success: false, message: "Comment not found. Sorry!" })  
    }
    post.comments = post.comments.filter(item => item._id != commentId)
    post.save()
    res.status(200).json({ success: true, post: post })
  }catch(error){
    console.log(error)
    res.status(500).json({ success: false, message: "Couldn't retrieve data. Sorry!" })
  }
}

module.exports = { getAllPosts, addPost,updateLike,removeLike,findPostById,addComment,removeComment }