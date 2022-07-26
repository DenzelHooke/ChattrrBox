import { useState } from "react";
import { BsFillEyeSlashFill, BsFillEyeFill } from "react-icons/bs";

function ShowPassword() {
  const [clicked, setClicked] = useState(false);

  const onClick = (e) => {
    const input = document.querySelector("#password");
    setClicked(!clicked);
    if (input.type === "password") {
      input.type = "text";
    } else {
      input.type = "password";
    }
  };
  return (
    <div className="checkbox" onClick={onClick}>
      {clicked ? <BsFillEyeFill size={30} /> : <BsFillEyeSlashFill size={30} />}
    </div>
  );
}

export default ShowPassword;
