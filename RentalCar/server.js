const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('/config/db');

//Route files
const cars = require('./routes/cars');

//Connect to database
connectDB();

//Load env vars
dotenv.config({path:'./config/config.env'});

const app = express();

//Bodyparser
app.use(express.json());

//Mount routers
app.use('/api/v1/cars',cars);

const PORT = process.env.PORT || 5000;
const server = app.listen(PORT,console.log('Server running in',process.env.NODE_ENV,'mode on port',PORT));

//Handle unhandled promise rejections
process.on('unhandledRejection',(err,promise) => {
    console.log(`Error: ${err.message}`);
    //Close server & exit process
    server.close(() => process.exit(1));
})