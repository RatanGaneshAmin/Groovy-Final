const express = require ('express');
const session = require('express-session');

const dotenv = require('dotenv');
const morgan = require('morgan');
const bodyparser = require('body-parser');
const path = require ("path");

//const connectDb=require('./server/database/connection');
const connectDB = require('./server/database/connection');

const app =express();

//take secret variable from config.env file
dotenv.config({path:'config.env'})
// if PORT is not there in .env file it will take 8080 as port by default.
const PORT = process.env.PORT|| 8080

app.use(session({
  secret: process.env.SESSION_SECRET || "supersecretkey", // move secret to .env
  resave: false,
  saveUninitialized: false,
  cookie: { 
    secure: false,           // true only if using HTTPS
    maxAge: 1 * 60 * 1000    // 5 minutes in milliseconds
  }
}));


//log requests
app.use(morgan('tiny'));

//mongodb connection
connectDB();

//parse request to body parser
app.use(bodyparser.urlencoded({extended:true}))

//set view engine
app.set("view engine","ejs")
//app.set("views",path.resolve(__dirname,"views/ejs"))

//load assets
app.use('/css',express.static(path.resolve(__dirname,"assets/css")))
app.use('/img',express.static(path.resolve(__dirname,"assets/img")))
app.use('/js',express.static(path.resolve(__dirname,"assets/js")))
//css/style.css

//load routers
app.use('/',require('./server/routes/router'))


app.listen(PORT, () =>{
    console.log(`Server is running on http://localhost:${PORT}`)
});
