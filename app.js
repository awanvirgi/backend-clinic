const express = require('express')
const app = express()

const allRoutes = require('./routes')

const PORT = process.env.PORT || 4000;

app.use(express.json())
app.use(allRoutes)

app.listen(PORT,()=>{
    console.log("Server Berjalan di PORT + ",PORT)
})