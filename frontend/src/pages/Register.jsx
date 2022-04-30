import {useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { reset, register } from '../features/auth/authSlice';
import { toast } from 'react-toastify';
import { BsPersonFill } from 'react-icons/bs';
import { FaUserAlt } from 'react-icons/fa';
import Spinner from '../components/Spinner';
import ShowPassword from '../components/ShowPassword';


function Register() {
  
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, isError, message, isSuccess, isLoading } = useSelector((state) => state.auth);

  useEffect(() => {
    if(isError){
      toast.error(message);
    }

    if(isSuccess || user) {
      toast.success('Account created successfully');
      navigate('/');
    }

    dispatch(reset())
  }, [isError, message, isSuccess])

  const [formData, setFormData] = useState({
    username:'',
    email:'',
    password:'',
    password2:'',
  })

  
  const { username, email, password, password2 } = formData;

  const onChange = (e) => {
    setFormData((prevState) => (
      {...prevState, [e.target.name]: e.target.value}
    ))}
  

  const onSubmit = (e) => {
    e.preventDefault();
    if(password !== password2) {
      toast.error('Passwords do not match');
      setFormData({...formData, password: '', password2:''});
    } else if ( !password || !password2 || !username || !email){
      toast.error('Please fill in all fields.');
    } else {
      //Send data to backend.
      const userData = {
        username, 
        email: email.toLowerCase(),
        password
      }
      dispatch(register(userData));
    }
  }

  if(isLoading) {
    return(
      <Spinner />
    )
  }

  return (
    <>
      <section className="header">
        <BsPersonFill size={70}/>
        <h2>Register</h2>
      </section>


      <div className="form-control">
        <form onSubmit={onSubmit} >
          <div className="form-group">
            <input 
              type="text" 
              className="form-input"
              id="username"
              name="username"
              value={username}
              onChange={onChange}
              placeholder="Enter your username"
            />
          </div>
          <div className="form-group">
            <input 
              type="email" 
              className="form-input"
              id="email"
              name="email"
              value={email}
              placeholder="Enter your email"
              onChange={onChange}
            />
          </div>
          <div className="form-group password">
            <input 
              type="password" 
              className="form-input"
              id="password"
              name="password"
              value={password}
              onChange={onChange}
              placeholder="Enter your password"
            />
            <ShowPassword />
          </div>
          <div className="form-group">
            <input 
              type="password" 
              className="form-input"
              id="password2"
              name="password2"
              value={password2}
              onChange={onChange}
              placeholder="Confirm password"
            />
            
          </div>
          <div className="form-group">
            <button className="form-btn" type="submit">Create Account</button>
          </div>
        </form>
      </div>
    
    </>
  )
}

export default Register