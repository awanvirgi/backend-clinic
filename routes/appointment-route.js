const express = require("express");
const { getAppointment, addAppointment } = require("../controllers/appointment-controller");

const route = express.Router()

route.get("/",getAppointment);
route.post("/",addAppointment)

module.exports = route
