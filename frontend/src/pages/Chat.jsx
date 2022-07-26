import { useEffect, useState, useRef } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
} from "react-router-dom";
import { toast } from "react-toastify";
import { useSelector, useDispatch } from "react-redux";
import { reset } from "../features/auth/authSlice";
import { updateUsersInRoom } from "../features/chat/chatSlice";
import ChatForm from "../components/ChatForm";
import Rooms from "../components/Rooms";
import Users from "../components/Users";
import io from "socket.io-client";
import "./styles/Chat.css";
import { v4 as uuidv4 } from "uuid";

function Chat() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { room } = useSelector((state) => state.chat);

  useEffect(() => {
    if (!user) {
      // toast.error('Please login first to view this page');
      navigate("/login");
    }
  }, [user, navigate]);

  const [chat, setChat] = useState([]);

  const socketRef = useRef();

  //SocketIO event handlers
  useEffect(() => {
    if (user) {
      // https://chattrrbox.herokuapp.com
      socketRef.current = io.connect("https://chattrrbox.herokuapp.com");

      //* Send identifiable user info to server
      socketRef.current.emit("init", {
        token: user.token,
        username: user.username,
        room: room.toLowerCase(),
      });

      // //* Send event to join socket to room.

      socketRef.current.on("message", ({ username, message }) => {
        const chat_box = document.querySelector(".chat-box-wrapper");
        console.log(chat_box);
        console.log(username + " " + message);
        setChat((prevState) => [
          ...prevState,
          { username: username, message: message },
        ]);
        chat_box.scrollBy({
          top: chat_box.scrollHeight,
          behavior: "smooth",
        });
        // chat_box.scrollTop = chat_box.scrollHeight;
      });

      socketRef.current.on("usersList", (data) => {
        dispatch(updateUsersInRoom(data.users));
      });

      //Wipe chat when user joins new room.
      socketRef.current.on("wipe", () => {
        setChat([]);
      });

      return () => socketRef.current.disconnect();
    }
  }, [user]);

  //Prevents chat from being displayed  for a milisecond if there is no user.
  if (!user) {
    return;
  }

  return (
    <>
      <div className="chat-container">
        <Rooms socketRef={socketRef} />
        <div className="main">
          <div className="room-name bg color-white">
            <h3>{`${room.charAt(0).toUpperCase()}${room.slice(1)}`}</h3>
          </div>
          <div className="chat-box-wrapper">
            <div className="chat-box">
              {chat.length > 0 ? (
                chat.map((item) => {
                  return (
                    <div
                      key={uuidv4()}
                      className={`message ${
                        item.username === user.username ? "me" : "recipient"
                      }`}
                    >
                      <span className="user">{item.username}</span>
                      <br />
                      <span className="text">{item.message}</span>
                    </div>
                  );
                })
              ) : (
                <p>No messages yet...</p>
              )}
            </div>
          </div>
          <ChatForm socketRef={socketRef} />
        </div>
        <Users socketRef={socketRef} />
      </div>
    </>
  );
}

export default Chat;
