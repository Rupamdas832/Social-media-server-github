const express = require("express")
const bodyParser = require("body-parser")
const cors = require("cors")

const app = express()
app.use(cors())
app.use(bodyParser.json())

const mySecret = process.env['Port']

const {initializeDBconnection} = require("./Database/DBconnect.js")
initializeDBconnection()

app.listen(mySecret, () => {
  console.log("SERVER IS running")
})