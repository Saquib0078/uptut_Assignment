const express = require('express')
const app = express()
const http = require('http')
const cors=require('cors')
const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
const multer = require("multer");
app.use(multer().any());
const { uploadFile } = require('./Utils/aws');

const server =http.createServer(app)
const {Server}=require("socket.io")


const io = new Server(server,{
    cors:{
        origin:'*',
        methods:["GET","POST"],
    },
});

app.post('/upload', async (req, res) => {
    try {
        let files = req.files
    if ((files && files.length) > 0) {
        //upload to s3 and get the uploaded link
        // res.send the link back to frontend/postman
        let share = await uploadFile(files[0]);
        return res.status(200).send({ status: true, data:share });

      } else {
        return res.status(400).send({ status: false, message: "please add  file!!" });
      }
    } catch (error) {
        return res.status(500).send({ status: false, message:error.message });

    }
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

socket.on('fileUploaded', (share) => {
    // display the share link to the user
        // socket.to(data.room).emit("revieve-message",data)

    console.log('File uploaded: ' + share);
  });


  socket.on('disconnect', () => {

    console.log('user disconnected');
  });
});


//----


server.listen(process.env.PORT || 3000, function(){
    console.log("Express app running on Port " + (process.env.PORT || 3000))
})

