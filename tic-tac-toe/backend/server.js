//importing req modules
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const ensureSecretKey = require('./middleware/generateSecret');
const http = require('http');
const {Server} = require('socket.io');
require('dotenv').config();

ensureSecretKey();

//initialize express app server
const app = express();
const server = http.createServer(app);

//server port
const PORT = process.env.PORT || 5000;

//middleware
app.use(bodyParser.json());
app.use(cors());

//app.use(verifyJWT);

//connect to mongoDB
mongoose.connect(process.env.DB_CONNECTION_URL, {useNewUrlParser : true, useUnifiedTopology : true})
.then(() => console.log(`Connected to MongoDB at ${process.env.DB_CONNECTION_URL}`))
.catch((e) => console.error(`{e}\nFailed to connect using url ${process.env.DB_CONNECTION_URL}`));

//define routes
app.use('/api/auth', require('./routes/auth'));

app.use('/api/games', require('./routes/games'));

app.use('/api/matches', require('./routes/matches'));

const io = new Server(server,{
    cors: {
      origin: "http://localhost:3000", // frontend URL
      methods: ["GET", "POST"]
    }
  });

io.on("connection", (socket) => {
    console.log("new user connected");

    socket.on('joinMatch', (matchId) => {
        console.log("user joined match room");
        socket.join(matchId);//creating a match room to emit game updates
    });

    socket.on('moveMade', (matchId, updatedMatch) => {
        console.log("socket received move from user");
        io.to(matchId).emit('gameUpdate',updatedMatch);//sending game move updates to users playing match with matchId
        console.log("sent move update to users");
    });

    socket.on('disconnect', () => {
        console.log("user disconnected");
    });
});
//run app server to listen on the assigned port
server.listen(PORT, ()=>{
    console.log(`App server running on port ${PORT}`);
});