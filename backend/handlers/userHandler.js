const users = require('../processes/chat');

const userJoin = (user, socketID) => { 
  // If the user already exists in the user array, return true.
  if(users.find(item => item.socketID === socketID)){
    return true;
  }
  users.push(user);
  // console.log('arr', users)
  return false;
}

const userRemove = (socketID) => { 
  // const user = userFind(socketID);
  const index = users.findIndex(user => user.socketID === socketID);
  if(index !== -1){
    console.log('removed') 
    return users.splice(index, 1)[0];
  }
}

const userFind = (socketID) => {
  const user = users.find(user => user.socketID === socketID);
  

  if(!user) return false;
  return user;
}

const changeRoom = (room, id) => {
  for(let i=0; i<users.length; i++){
    if(users[i].socketID === id){
      users[i].room = room;
      // console.log(users[i])
    }
  // console.log(users)
  }
}

const getUsersInRoom = (room) => {
  // console.log(room)
  // console.log(users)
  const unfiltered = users.filter(user => user.room === room)
  if(unfiltered.length < 1) {
    return []
  }
  // console.log(unfiltered)
  const inRoom = unfiltered.map(user => {
    // console.log(user)
    return {
      username: user.username,
      room: user.room,
    };
  })
  
  return inRoom;
}

const cleanUpOldSockets = (username) => {
  //Loops through arr and checks for duplicat6e objects that share the same username.

  // console.log(users)
  // console.log(username)
  if(users.length > 0) {
    // console.log('checking arr')
    for(let i=0; i<users.length; i++) {
      if (users[i].username.toLowerCase() == username) {
        console.log(users[i])
        const index = users.indexOf(users[i]);
        users.splice(index, 1);
      }
    }
  }
}

module.exports = {
  userJoin,
  userFind,
  changeRoom,
  userRemove,
  getUsersInRoom,
  cleanUpOldSockets,
}