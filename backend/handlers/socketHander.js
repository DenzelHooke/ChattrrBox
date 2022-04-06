const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

const handleSocketValidation = async (token, username, room, socketID) => {
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    //Returns the entire document except the password field.
    const user = await User.findById(decoded.id).select('-password')
    if(user) {
      // console.log('token valid')
      //Returns once user resolves.
      return {
        _id: decoded.id,
        socketID: socketID,
        username: username,
        room: room,
      }
    }
  } catch (error) {
    console.log(`\n------------\nError in socketValidation:\nCulprit: ${username}\nToken: "${token}"\nStack: ${error.stack}\n------------\n`)
    return false;
  }
  
}


module.exports = {
  handleSocketValidation,
}