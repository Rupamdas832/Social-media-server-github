const express = require("express")
const router = express.Router()

const { getNotificationData, addNotification, getNotificationDataByUserId } = require("./notifications.controller.js")

router.route("/").get(getNotificationDataByUserId, getNotificationData)

router.route("/:userIdToUpdate").post(addNotification)

module.exports = router