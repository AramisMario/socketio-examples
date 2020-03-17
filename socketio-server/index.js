const express = require("express");
const path = require('path');
const app = express();
const SocketIO = require('socket.io');

//setting

app.set('port',process.env.PORT || 3000);
app.use(express.static(path.join(__dirname,'public')));
//server
const server = app.listen(app.get('port'),()=>{
  console.log(`server running on port ${app.get('port')}`);
});

const io = SocketIO(server);

//websockets
io.on('connection',(socket)=>{
    console.log('new connection',socket.id);
    socket.on('chat:message',(data)=>{
      io.sockets.emit('chat:message',data); // lo envia a todos
    });

    socket.on("chat:typing",(data)=>{
      socket.broadcast.emit("chat:typing",data); // lo envia a todos menos al que emitio
    })
});
