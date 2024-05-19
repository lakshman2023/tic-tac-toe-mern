//importing req modules
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();

//initialize express app server
const app = express();

//server port
const PORT = process.env.PORT || 5000;

//middleware
app.use(bodyParser.json());
app.use(cors());

//connect to mongoDB
mongoose.connect(process.env.DB_CONNECTION_URL, {useNewUrlParser : true, useUnifiedTopology : true})
.then(() => console.log(`Connected to MongoDB at ${process.env.DB_CONNECTION_URL}`))
.catch((e) => console.error(`{e}\nFailed to connect using url ${process.env.DB_CONNECTION_URL}`));

//define routes
app.use('/api/games', require('./routes/games'))

//run app server to listen on the assigned port
app.listen(PORT, ()=>{
    console.log(`App server running on port ${PORT}`);
})