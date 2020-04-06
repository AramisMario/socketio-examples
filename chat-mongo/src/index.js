const http = require("http");
const express = require("express");
const socketio = require("socket.io");
const path = require("path");

const mongoose = require("mongoose");

const app = express();
const server = http.createServer(app);
const io = socketio.listen(server);

mongoose.connect('mongodb://localhost/chat-database')
    .then(db => console.log('db is connected'))
    .catch(Error => console.log(Error));

//port
app.set('port',process.env.PORT || 3000);

require('./sockets')(io);
//static files
app.use(express.static(path.join(__dirname,'public')));

// starting server
server.listen(3000, ()=> console.log(`server runnig on port ${app.get('port')}`));
