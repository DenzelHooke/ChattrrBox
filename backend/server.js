const express = require("express");
const dotenv = require("dotenv").config();
const socketio = require("socket.io");
const cors = require("cors");
const http = require("http");
const { errorHandler } = require("./middleware/errorMiddlware");
const {connectDB} = require("./config/db");
const colors = require('colors'); 
const { handleSocketValidation } = require("./handlers/socketHander");
const users = require('./processes/chat');



connectDB()
const app = express();
const server = http.createServer(app);
const io = socketio(server, {
  cors: {
    origin: '*'
  }
});

var corsOptions = {
  origin: '*',
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}



//Set middleware
app.use(cors(corsOptions));
// Allows us to parse json req body.
app.use(express.json());
// Allows us to parse urlencoded req body.
app.use(express.urlencoded({ extended: false }));



// Socket handling
io.on('connection', (socket) => {
  console.log('User has connected.');

  //Runs when user connects
  socket.on('assign', ({ token, username }) => {
    console.log('handler hit');
    //Check if token is valid
    const valid = handleSocketValidation(token, username);
    //Add user to users list if valid.
    if(!valid) return;
    
    users.push([...users, {}])

  })

  // On joinRoom message
  socket.on('joinRoom', ({ room }) => {
    console.log(room)
    socket.join(room.toLowerCase())
  })

  socket.on('message', message => {
    console.log(message)
    io.emit('message', { username: message.user.username, message: message.message });
  })
});



//* Routes
app.use('/api/users/', require('./routes/userRoutes'));
app.use('/api/chat/', require('./routes/chatRoutes'));



//Overwrite default Error handler.
app.use(errorHandler);
const PORT = process.env.PORT || 8080;
server.listen(PORT, (e) => {
  console.log(`Server is running on port ${PORT}`);
});
