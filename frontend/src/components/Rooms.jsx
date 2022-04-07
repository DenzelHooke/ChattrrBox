import { useState, useEffect } from 'react'
import { BsHouseDoorFill } from 'react-icons/bs';
import { BsDoorOpenFill } from 'react-icons/bs';
import { BsCodeSlash } from 'react-icons/bs';
import { GrYoga } from 'react-icons/gr';
import { IconContext } from "react-icons";
import { changeRoom } from '../features/chat/chatSlice';
import { useDispatch, useSelector } from 'react-redux';

function Rooms({ socketRef }) {
  const dispatch = useDispatch();
  const { room } = useSelector((state) => state.chat);

  // Not the best approach as I don't like hard coding values in.
  const [roomJoined, setRoomJoined] = useState({
    general: null,
    coding: null,
    chill: null,
  })

  useEffect(() => {
    //Sets btn bgcolor on init
    document.querySelector(`button#${room}`).classList.add('clicked');
  }, [])

  const onClick = (e) => {
    e.preventDefault();
    
    if(e.target.name.toLowerCase() === room.toLowerCase()) {
      return
    }

    //Set all to unclicked
    document.querySelectorAll('.clicked').forEach(item => {
      item.classList.remove('clicked')
    })

    //Set roomJoined
    document.querySelector(`#${e.target.id}`).classList.add('clicked')
    
    const currentRoom = room;
    dispatch(changeRoom(e.target.name));
    socketRef.current.emit('joinRoom', { newRoom: e.target.name.toLowerCase(), currentRoom: currentRoom });
  }

  

  return (
    <>
        <form className="rooms">
          <div className="room-item">
            <button className="btn bg" id="coding" type="submit" name="Coding" onClick={onClick}>{ <BsDoorOpenFill size={45} /> }</button>
          </div>
          <div className="room-item">
            <button className="btn bg" id="general" type="submit" name="General" onClick={onClick}>{ <BsDoorOpenFill size={45} /> }</button>
          </div>
          <div className="room-item">
            <button className="btn bg" id="chill" type="submit" name="Chill" onClick={onClick}>{ <BsDoorOpenFill size={45} stroke="#fff"/> }</button>
          </div>
        </form>
    </>
  )
}

export default Rooms