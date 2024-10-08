const express = require("express");
const route = express.Router()

const patientRoute = require('./patient-route')

route.get("/", (req, res) => {
    res.json({
        message: "Selamat datang di express"
    })
})

route.use("/patient",patientRoute)

module.exports = route