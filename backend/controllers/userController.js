const asyncHandler = require('express-async-handler');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const User = require('../models/userModel');

// @desc Get User
// @route Get /api/users
// @access Public
const getUser = (req, res) => {
  console.log('getUser endpoint hit!')
  res.status(200).json({
    user: "coolname101",
    message: "Hello guys!"
  })
}

// @desc Register User
// @route POST /api/users/register
// @access Public
const registerUser = asyncHandler( async(req, res) => {
  console.log('registerUser endpoint hit!')

  const { username, email, password } = req.body;


  if(!username || !email || !password) {
    res.status(400);
    throw new Error('Invalid Credentials');
  }

  //cHECK IF USER ALRDY EXISTS 

  const exists = await User.findOne({ email });
  if (exists) {
    res.status(400);
    throw new Error('A user with that email already exists');
  }

  //TODO Create salt and hash password
  const salt = await bcrypt.genSalt(10);
  const hashed_pass = await bcrypt.hash(password, salt);

  //TODO Create user
  const newUser = await User.create({
    username,
    email, 
    password: hashed_pass
  })

  //TODO gen jwt token
  //TODO return res
  if(newUser){
    res.status(201).json({
      _id: newUser.id,
      username: newUser.username,
      email: newUser.email,
      token: generateToken(newUser.id),
    })
  } else {
    res.status(401);
    throw new Error('Invalid User data');
  }
})

// @desc Login User
// @route POST /api/users/login
// @access Public
const loginUser = asyncHandler( async(req, res) => {
  console.log('Login endpoint hit');

  const { username, password } = req.body;

  // Little bit of regex which says the match should contain the username as the entire match regardless of case-sensitivity.
  const user = await User.findOne({ username: { $regex: `${username}`, $options: 'i' } });
  console.log(user)
  if (user &&  await bcrypt.compare(password, user.password)) {
    res.status(200).json({
      _id: user.id,
      username: user.username,
      email: user.email,
      token: generateToken(user.id),
    })
  } else {
    res.status(401)
    throw new Error('Username or email is incorrent');
  }
} )

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d'
  })
}

module.exports = {
  loginUser,
  registerUser,
}