import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    data:[
  { file: "file_8.xls", date: "21.11.2024", id: 1 },
  { file: "file_9.xls", date: "22.11.2024", id: 2 },
  { file: "file_10.xls", date: "23.11.2024", id: 3 },
  { file: "file_11.xls", date: "24.11.2024",id: 4 },
  { file: "file_12.xls", date: "25.11.2024", id: 5 },
],
    activeElem:null
};

const passSlice = createSlice({
  name: 'passSlice',
  initialState,
  reducers: {
    toggleActive: (state, action) => {
      const id = action.payload;
      state.activeElem = state.data.find(file => file.id === id);
    },
  },
});

export const { toggleActive } = passSlice.actions;
export default passSlice.reducer;
