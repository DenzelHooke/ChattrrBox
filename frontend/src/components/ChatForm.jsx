import { useState } from "react";
import { useSelector } from "react-redux";
import { IoSendSharp } from "react-icons/io5";

function ChatForm({ socketRef }) {
  const { user } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    message: "",
    user,
  });

  const { message } = formData;

  const onSubmit = (e) => {
    e.preventDefault();
    if (message) {
      socketRef.current.emit("message", { user: user, message: message });
    }
    setFormData({ ...FormData, message: "" });
  };

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <div className="form-control message-form">
      <form onSubmit={onSubmit}>
        <div className="form-group chat">
          <input
            type="text"
            className="form-input chat-input"
            id="message"
            name="message"
            value={message}
            onChange={onChange}
            placeholder="Enter a message"
          />
          <button className="form-btn" type="submit">
            <IoSendSharp color="#4EAFE5" size={30} />
          </button>
        </div>
      </form>
    </div>
  );
}

export default ChatForm;
