const Chat = require('./models/Chat');

module.exports = function(io){

  let users = {
  
  };

  io.on('connection', async (socket) =>{
    console.log("new user connection");

    let messages = await Chat.find({}).limit(8);
    socket.emit('load old msgs',messages);

    socket.on("send message", async (data,cb)=>{

      var msg = data.trim();
      if(msg.substr(0,3)==='/w '){  
        msg = msg.substr(3); // lo que sigue despues del indice 3
        const index = msg.indexOf(' ');
        if(index !== -1){
          var name = msg.substring(0,index);
          var msg = msg.substring(index + 1);
          if(name in users){
            console.log(users[name]);
            users[name].emit('whisper',{
              msg,
              nick:socket.nickname
            });
          }else{
            cb('Error! Por favor ingresa un usuario valido');
          }
        }else{
          cb('Error! Por favor ingresa tu mensaje');
        }
      }else{
        var newMsg = new Chat({
          msg:msg,
          nick: socket.nickname
        });
        await newMsg.save();
        io.sockets.emit("new message", {
          msg:data,
          nick: socket.nickname
        });
      }

    });

    socket.on("new user", (data,cb) =>{
      if(data in users){
        cb(false);
      }else{
        cb(true);
        socket.nickname = data;
        users[socket.nickname] = socket;
        updateNicknames();
      }
    });
    
    socket.on('disconnect',data=>{
      if(!socket.nickname)return;
      delete users[socket.nickname];
      updateNicknames();
    });
  });
  function updateNicknames(){
    io.sockets.emit("usernames",Object.keys(users));
  }
}
