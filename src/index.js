const express = require('express')
const app = express()
const http = require('http')
const cors=require('cors')
app.use(cors());
const server =http.createServer(app)
const {Server}=require("socket.io")
const allowedOrigins = ['https://uptut.netlify.app/', 'http://localhost:3001'];
app.use(cors({
  origin: function(origin, callback) {
    // Check if the origin is allowed
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  }
}));

const io = new Server(server,{
    cors:{
        origin:'http://localhost:3001',
        methods:["GET","POST"],
    },
});


io.on('connection', (socket) => {

  console.log('a user connected',socket.id);

socket.on('join-room',(data)=>{
    socket.join(data)
    console.log(`userId${socket.id} joined:${data}`)
})

socket.on("send-message",(data)=>{
    socket.to(data.room).emit("revieve-message",data)
})


  socket.on('disconnect', () => {

    console.log('user disconnected');
  });
});
//----


server.listen(process.env.PORT || 3000, function(){
    console.log("Express app running on Port " + (process.env.PORT || 3000))
})
