import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const room = JSON.parse(localStorage.getItem('room'));

const initialState = {
  room: room ? room : 'general',
  usersInRoom: [],
}


export const chatSlice = createSlice({
  name: 'chat',
  initialState: initialState,
  reducers: {
    changeRoom: (state, action) => {
      state.room = action.payload.toLowerCase();
    },
    updateUsersInRoom: (state, action) => {
      console.log(action.payload);
      state.usersInRoom = action.payload;
    }
  },
})


export const {
  changeRoom, updateUsersInRoom
} = chatSlice.actions;

export default chatSlice.reducer;