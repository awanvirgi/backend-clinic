const express = require("express");
const { getAllMidwafe, addMidwafe, editMidwafe, deleteMidwafe } = require("../controllers/midwife-controllers");
const route = express.Router()

route.get("/",getAllMidwafe)
route.post("/",addMidwafe)
route.put("/:id",editMidwafe)
route.delete("/:id",deleteMidwafe)

module.exports = route