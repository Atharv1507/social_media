import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  items: []
};

export const postSlice= createSlice({
  name: 'post',
  initialState,
  reducers: {
    setPostsRedux:(state,action)=>{
        state.items= action.payload
    },
    addPostRedux:(state,action)=>{
        state.items.unshift(action.payload)
    }
  },
});

// Export the auto-generated action creators
export const { setPostsRedux, addPostRedux } = postSlice.actions;

// Export the reducer to handle store integration
export default postSlice.reducer;