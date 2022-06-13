import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../features/auth/authSlice";
import { AiOutlineWechat } from "react-icons/ai";

function Navbar() {
  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.auth);

  const onClick = () => {
    dispatch(logout());
  };

  return (
    <div className="navbar">
      <h1>
        <Link to="/">
          <AiOutlineWechat color={"#4EAFE5"} />
          ChatterBox
        </Link>
      </h1>
      <ul>
        {user ? (
          <>
            <li>
              <a href="#" onClick={onClick}>
                Logout
              </a>
            </li>
          </>
        ) : (
          <>
            <li>
              <Link to="/register">Register</Link>
            </li>
            <li>
              <Link to="/login">Login</Link>
            </li>
          </>
        )}
      </ul>
    </div>
  );
}

export default Navbar;
