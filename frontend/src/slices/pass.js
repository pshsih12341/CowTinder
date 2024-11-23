import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  data: JSON.parse(localStorage.getItem("passes")) || [],
  activeElem: null,
  currentSendElem:null,
};
const passSlice = createSlice({
  name: 'passSlice',
  initialState,
  reducers: {
    toggleActive: (state, action) => {
      const id = action.payload;
      state.activeElem = state.data.find(el => el.id === id);
    },
    addPass:(state,action) => {
      const id = state.data.length +1;
      const createDate = new Date();
      action.payload = {...action.payload,id,createDate}
      state.data = [...state.data, action.payload];
      localStorage.setItem("passes", JSON.stringify(state.data));
    },
    setSend:(state,action) => {
      const {direction,type} = action.payload
      state.currentSendElem = {...state.activeElem,direction,type};
    }
  },
});

export const { toggleActive,addPass,setSend} = passSlice.actions;
export default passSlice.reducer;
