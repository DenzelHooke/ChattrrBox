const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

const handleSocketValidation = async (token, username) => {
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log(decoded);

    
    //Returns the entire document except the password field.
    const user = await User.findById(decoded.id).select('-password')
    if(user) {
      console.log(user)
      return {
        ...user,
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