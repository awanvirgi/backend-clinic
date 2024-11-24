const express = require("express");
const route = express.Router()

const { getAllPatient, addPatient, deletePatient, editPatient, getPatientperPage } = require('../controllers/patient-controllers')

route.get("/",getAllPatient)
route.post("/",addPatient)
route.put("/:id",editPatient)
route.delete("/:id",deletePatient)

module.exports = route