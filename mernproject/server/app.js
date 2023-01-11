const dotenv = require("dotenv");
const express = require("express");
const app = express();

dotenv.config({path:'./config.env'});
require("./db/conn");
const PORT = process.env.PORT;

// Link Router File (This is also a middleware)
app.use(require('./router/auth'));

// const User = require("./model/userSchema");


app.listen(PORT,()=>{
    console.log(`Running on ${PORT}`);
})