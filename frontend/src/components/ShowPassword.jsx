import { useState } from 'react'
import { BsFillEyeSlashFill, BsFillEyeFill } from 'react-icons/bs'

function ShowPassword() {
  const [clicked, setClicked] = useState(false)

  const onClick = (e) => {
    const input = document.querySelector('#password');
    setClicked(!clicked)
    if(input.type === 'password') {
      input.type = 'text';
    } else {
      input.type = 'password'
    }
  }
  return (
    <label className="checkbox">
      {
        clicked
        ? 
        <BsFillEyeFill size={30} />
        :
        <BsFillEyeSlashFill size={30} />
      }
      <input type="checkbox"  onClick={onClick} />
    </label>
  )
}

export default ShowPassword