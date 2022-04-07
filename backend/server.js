const express = require("express");
const path = require("path");
const dotenv = require("dotenv").config();
const socketio = require("socket.io");
const cors = require("cors");
const http = require("http");
const { errorHandler } = require("./middleware/errorMiddlware");
const {connectDB} = require("./config/db");
const colors = require('colors'); 
const { handleSocketValidation } = require("./handlers/socketHander");
const {
   userJoin, 
   userFind, 
   changeRoom, 
   userRemove, 
   getUsersInRoom, 
   cleanUpOldSockets 
  } = require("./handlers/userHandler");
const users = require('./processes/chat');

const BOT_NAME = 'ChattrBot'

connectDB()
const app = express();
const server = http.createServer(app);

const corsAllowed = (req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'https://chattrrbox.herokuapp.com/');
  res.header('Access-Control-Allow-Methods', 'GET,POST');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
}


const io = socketio(server, {
  cors: {
    origin: 'https://chattrrbox.herokuapp.com/'
  }
});

var corsOptions = {
  origin: 'http://localhost:3000',
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}



//Set middleware
// app.use(cors(corsOptions));
app.use(corsAllowed)
// Allows us to parse json req body.
app.use(express.json());
// Allows us to parse urlencoded req body.
app.use(express.urlencoded({ extended: false }));



// Socket handling
io.on('connection', (socket) => {
  
  console.log('user connected')
  //Runs when user connects
  socket.on('init', async ({ token, username, room }) => {
    //* INIT

    // Clean up old users with same usersnames but different sockets.
    cleanUpOldSockets(username.toLowerCase());


    const socketID = socket.id;
    //Check if token is valid
    const valid = await handleSocketValidation(token, username, room, socketID);
    //Add user to users list if valid.
    if(!valid) {
      socket.emit('tokenInvalid')
      socket.disconnect();
      return
    }
    // Add user to array
    // Returns true if user is already in users array(Already connected to a room)
    
    //?It's virtually impossible for the socket to be added into the array twice but extra safety is better than none.
    const alreadyExists = userJoin(valid, socketID);
    if(!alreadyExists) {
      socket.join(valid.room);
      //Send new user list to room
      io.in(valid.room).emit(
        'usersList',
        {
          users: getUsersInRoom(valid.room)
        }
      )
      
      //Send join message to all sockets in the init room (general).
      socket.to(valid.room).emit('message', { 
        username: BOT_NAME, 
        message:`${valid.username} has joined`,
        flag: 'BOT'
      })
    } else{
      console.log('User already exists in chat.')
    }
  })
  
  // On joinRoom message
  socket.on('joinRoom', ({ newRoom, currentRoom }) => {
    console.log(`Join Room Hit`);
    let user = userFind(socket.id);
    console.log('Socket before change:', socket.rooms)

    //Check if user is trying to switch to their current room.
    if(user.room === newRoom) {
      return;
    } 

    //Wipe old text on frontend

    socket.emit('wipe')

    //* Leave Phase

    const socketID = socket.id;
    socket.leave(currentRoom);
    changeRoom(newRoom, socketID);

    //Emit message to old room.
    socket.to(currentRoom).emit('message', { 
      username: BOT_NAME, 
      message:`${user.username} has left chat`,
      flag: 'BOT'
    })

    //Send new user list to old room
    io.in(currentRoom).emit(
      'usersList',
      {
        users: getUsersInRoom(currentRoom)
      }
    )
    
    //* Join Phase

    socket.join(newRoom);
    console.log('Socket after change:', socket.rooms)

    user = userFind(socketID);
    
    socket.to(user.room).emit('message', { 
      username: BOT_NAME, 
      message:`${user.username} has joined`,
      flag: 'BOT'
    })
    
    //Send new user list to new room
    io.in(user.room).emit(
      'usersList',
      {
        users: getUsersInRoom(newRoom)
      }
    )
  })

  socket.on('message', message => {
    const socketID = socket.id;
    const user = userFind(socketID);
    // console.log(`Message hit: ${user}`)
    // console.log(user)
    // console.log(message)
    io.in(user.room).emit(
      'message', 
      {
         username: user.username, 
         message: message.message 
      }
    );
  })

  socket.on('disconnect', () => {
    const socketID = socket.id;
    const user = userRemove(socketID);
    
    if(user) {
      //Send message to all users
      io.in(user.room).emit(
        'message',
        {
          username: BOT_NAME, 
          message:`${user.username} has left the chat`,
          flag: 'BOT'
        }
      )

      //Send new user list
      io.to(user.room).emit(
        'usersList',
        {
          users: getUsersInRoom(user.room)
        }
      )
    }
  })
});



//* Routes
app.use('/api/users/', require('./routes/userRoutes'));
app.use('/api/chat/', require('./routes/chatRoutes'));

// Serve production

if(process.env.NODE_ENV === 'production'){
  //* Set static to our react build folder.
  app.use(express.static(path.join(__dirname, '../frontend/build')))

  // Any route asside for the api routes, send this file.
  app.get('*', (req, res) => res.sendFile(
    path.resolve(__dirname, '../', 'frontend', 'build', 'index.html')
    )
  )
}


//Overwrite default Error handler.
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
server.listen(PORT, (e) => {
  console.log(`Server is running on port ${PORT}`);
});
