import {useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { reset, login } from '../features/auth/authSlice';
import { toast } from 'react-toastify';
import { BsPersonFill } from 'react-icons/bs';
import { FaUserAlt } from 'react-icons/fa';
import Spinner from '../components/Spinner';
import ShowPassword from '../components/ShowPassword';


function Login() {
  const navigate = useNavigate();

  const dispatch = useDispatch();
  const { user, isError, message, isSuccess, isLoading } = useSelector((state) => state.auth);

  useEffect(() => {
    if(isError){
      toast.error(message);
    }

    if(isSuccess || user) {
      toast.success('Welcome');
      navigate('/');
    }

    dispatch(reset())
  }, [isError, message, isSuccess])

  const [formData, setFormData] = useState({
    username:'',
    password:'',
  })

  
  const { username, password } = formData;

  const onChange = (e) => {
    setFormData((prevState) => (
      {...prevState, [e.target.name]: e.target.value}
    ))}
  

  const onSubmit = (e) => {
    e.preventDefault();
    if(!password || !username) {
      toast.error('Fields cannot be empty');
      setFormData({ ...formData, password: '' });
    } else {
      //Send data to backend.
      const userData = {
        username, 
        password
      }
      dispatch(login(userData));
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
        <h2>Login</h2>
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
            <button className="form-btn" type="submit">Login</button>
          </div>
        </form>
      </div>
    
    </>
  )
}

export default Login;