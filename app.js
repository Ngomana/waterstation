const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
// load env vars
dotenv.config({ path: './config/config.env' });
// initialize the express app
const app = express();

app.use(express.json())
app.use(cors())

// connect to database
connectDB();


const waterStationRouter = require('./routes/waterstations');
app.use('/waterstations', waterStationRouter);


const PORT = process.env.PORT || 1234;

app.listen(PORT, () =>
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
);