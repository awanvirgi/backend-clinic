const express = require("express");
const route = express.Router()

const patientRoute = require('./patient-route')
const midwiferoute = require('./midwife-route')

route.get("/", (req, res) => {
    res.json({
        message: "Selamat datang di express"
    })
})

route.use("/patient",patientRoute)
route.use("/midwife",midwiferoute)

module.exports = route