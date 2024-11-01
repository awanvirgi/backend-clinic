const express = require("express");
const route = express.Router()

const patientRoute = require('./patient-route')
const midwiferoute = require('./midwife-route')
const appointmentRoute = require('./appointment-route')

route.get("/", (req, res) => {
    res.json({
        message: "Selamat datang di express"
    })
})

route.use("/patient",patientRoute)
route.use("/midwife",midwiferoute)
route.use("/appointment",appointmentRoute)

module.exports = route