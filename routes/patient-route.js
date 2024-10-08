const express = require("express");
const route = express.Router()

const { getAllPatient, addPatient } = require('../controllers/patient-controllers')

route.get("/",getAllPatient)
route.post("/",addPatient)

module.exports = route