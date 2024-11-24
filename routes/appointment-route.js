const express = require("express");
const { getAppointment, addAppointment, updateAppointment, deleteAppointment, getAppointmentById } = require("../controllers/appointment-controller");

const route = express.Router()

route.get("/",getAppointment);
route.get("/:id",getAppointmentById)
route.post("/",addAppointment);
route.put("/:id",updateAppointment);
route.delete("/:id",deleteAppointment)

module.exports = route
