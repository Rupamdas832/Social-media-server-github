const express = require("express")
const router = express.Router()

const { loginUserWithCredentials, signupUserWithEmailAndPassword, userAuthentication, authVerify, userDetailsUpdate, getAllUsers, followUser, getUserByUserName,unfollowUser } = require("./users.controller.js")

router.route("/users").get(getAllUsers)

router.route("/signup").post(signupUserWithEmailAndPassword)

router.route("/login").post(loginUserWithCredentials)

router.route("/user")
  .get(authVerify, userAuthentication)
  .post(authVerify, userDetailsUpdate)

router.route("/user/follow")
  .post(authVerify, followUser)
  .delete(authVerify,unfollowUser)

router.route("/user/:userName")
  .get(authVerify, getUserByUserName)


module.exports = router;