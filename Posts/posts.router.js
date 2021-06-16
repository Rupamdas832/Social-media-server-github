const express = require("express")
const router = express.Router()

const { getAllPosts, addPost,updateLike,removeLike,findPostById,addComment,removeComment  } = require("./posts.controller.js")
const {authVerify} = require("../Users/users.controller.js")

router.route("/")
  router.param("postId", findPostById)

router.route("/")
.get(getAllPosts)
.post(authVerify, addPost)

router.route("/:postId/like")
  .post(authVerify,updateLike)
  .delete(authVerify,removeLike)

router.route("/:postId/comment")
  .post(authVerify, addComment)
  .delete(authVerify,removeComment)

module.exports = router