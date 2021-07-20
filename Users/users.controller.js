const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")
const { User } = require("./users.model.js")

const secretKey = process.env['TokenSecretKey']

const loginUserWithCredentials = async (req, res) => {
  const { userCredential, password } = req.body;

  try {
    const foundUserByEmail = await User.findOne({ email: userCredential }).select("password")
    const foundUserByUserName = await User.findOne({ userName: userCredential }).select("password")


    if (!foundUserByEmail && !foundUserByUserName) {
      return res.status(404).json({ success: false, message: "User  not found" })
    } else if (foundUserByEmail || foundUserByUserName) {
      let foundUser
      if (foundUserByEmail) {
        foundUser = foundUserByEmail
      } else if (foundUserByUserName) {
        foundUser = foundUserByUserName
      }
      if (bcrypt.compareSync(password, foundUser.password)) {
        const token = jwt.sign({ userId: foundUser._id }, secretKey, { expiresIn: '24h' })
        const user = await User.findById(foundUser._id)
        res.status(200).json({ success: true, user: user, token: token })
      }
    }
    else res.status(401).json({ success: false, message: "Sorry! Password is wrong" })
  } catch (error) {
    console.log(error)
    res.status(500).json({ success: false, message: "Sorry! Something went wrong" })
  }
}

const signupUserWithEmailAndPassword = async (req, res) => {
  const { name, email, password, userName } = req.body;

  try {

    const foundEmail = await User.findOne({ email: email })
    const foundUserName = await User.findOne({ userName: userName })

    if (foundEmail) {
      return res.status(400).json({ success: false, message: "Email already present.Try with different email Id" })
    } else if (foundUserName) {
      return res.status(400).json({ success: false, message: "userName already taken.Try with different userName" })
    }
    const newUser = new User({
      name: name,
      email: email,
      password: bcrypt.hashSync(password, 8),
      userName: userName,
      profileImg: "",
      coverImg: "",
      bio: "",
      website: "",
      followers: [],
      following: []
    })

    const saveUser = await newUser.save()

    const token = jwt.sign({ userId: saveUser._id }, secretKey, { expiresIn: '24h' })

    saveUser.password = undefined
    res.status(201).json({ success: true, user: saveUser, token: token })

  } catch (error) {
    console.log(error)
    res.status(500).json({ success: false, message: "Sorry! couldn't signup. Retry...", error })
  }
}

const userAuthentication = async (req, res) => {
  const { userId } = req

  try {
    const foundUser = await User.findById(userId)

    if (!foundUser) {
      return res.status(400).json({ success: false, message: "User Email not found" })
    } else {
      foundUser.password = undefined
      res.status(200).json({ success: true, user: foundUser })
    }
  } catch (error) {
    console.log(error)
    res.status(500).json({ success: false, message: "Sorry! Something went wrong" })
  }
}

const authVerify = (req, res, next) => {
  const token = req.headers.authorization;

  try {
    const decoded = jwt.verify(token, secretKey)
    req.userId = decoded.userId
    return next();
  } catch (error) {
    console.log(error)
    res.status(401).json({ message: "Unauthorised access, please add the token" })
  }
}

const userDetailsUpdate = async (req, res) => {
  const { profileImg, coverImg, bio, website } = req.body
  const { userId } = req

  try {
    let user = await User.findById(userId)
    user.profileImg = profileImg;
    user.coverImg = coverImg;
    user.bio = bio;
    user.website = website;

    user = await user.save()
    res.status(201).json({ success: true, user: user })
  } catch (error) {
    console.log(error)
    res.status(500).json({ success: false, message: "Couldn't be updated. Sorry!", error })
  }

}

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({})
    if (!users) {
      res.status(404).json({ success: false, message: "No users found. Sorry!" })
    }
    res.status(200).json({ success: true, users: users })
  } catch (error) {
    console.log(error)
    res.status(500).json({ success: false, message: "Couldn't retrieve data. Sorry!" })
  }
}

const followUser = async (req, res) => {
  const { userIdToFollow } = req.body
  const { userId } = req
  try {
    let userToFollow = await User.findById(userIdToFollow)
    let user = await User.findById(userId)
    if (!userToFollow && !user) {
      return res.status(400).json({ success: false, message: "Users not found" })
    }
    const newFollower = {
      userId: user._id,
      userName: user.userName,
      profileImg: user.profileImg,
      name: user.name
    }
    const newFollowing = {
      userId: userToFollow._id,
      userName: userToFollow.userName,
      profileImg: userToFollow.profileImg,
      name: userToFollow.name
    }

    user.following.push(newFollowing)
    userToFollow.followers.push(newFollower)

    user = await user.save()
    userToFollow = await userToFollow.save()

    res.status(201).json({ success: true, user: user, userToFollow: userToFollow })
  } catch (error) {
    console.log(error)
    res.status(500).json({ success: false, message: "Couldn't retrieve data. Sorry!" })
  }
}

const getUserByUserName = async (req, res) => {
  const { userName } = req.params
  try {
    const foundUser = await User.findOne({ userName: userName })
    if (!foundUser) {
      return res.status(400).json({ success: false, message: "User  not found" })
    }
    res.status(200).json({ success: true, user: foundUser })
  } catch (error) {
    console.log(error)
    res.status(500).json({ success: false, message: "Couldn't retrieve data. Sorry!" })
  }
}

module.exports = { loginUserWithCredentials, signupUserWithEmailAndPassword, userAuthentication, authVerify, userDetailsUpdate, getAllUsers, followUser, getUserByUserName }