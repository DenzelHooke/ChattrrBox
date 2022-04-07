import { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux';
import { updateUsersInRoom } from '../features/chat/chatSlice';
import { v4 as uuidv4 } from 'uuid'

function Users({ socketRef }) {
  const dispatch = useDispatch();

  const { usersInRoom } = useSelector((state) => state.chat)

  // const [usersInRoom, setUsersInRoom] = useState([])

  return (
    <div className="users color-white bg">
      <h4>In Room</h4>
      <ul>
        {
          usersInRoom.map((user) => {
            console.log(usersInRoom)
            return (
              <li key={uuidv4()}>{user.username}</li>
            )
          })
        }
      </ul>
    </div>
  )
}

export default Users