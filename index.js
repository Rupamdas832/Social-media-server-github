const express = require("express")
const bodyParser = require("body-parser")
const cors = require("cors")

const app = express()
app.use(cors())
app.use(bodyParser.json())

const mySecret = process.env['Port']

const {initializeDBconnection} = require("./Database/DBconnect.js")
initializeDBconnection()

const {authVerify} = require("./Users/users.controller")

app.get("/", (req,res) => {
  res.json({success: true, message:"Working fine"})
})

const usersRouter = require("./Users/users.router.js")
app.use("/", usersRouter)

const postsRouter = require("./Posts/posts.router.js")
app.use("/posts", postsRouter)

app.use(authVerify)

const notificationDataRouter = require("./Notifications/notifications.router")
app.use("/notifications", notificationDataRouter)

app.listen(mySecret, () => {
  console.log("SERVER IS running")
})