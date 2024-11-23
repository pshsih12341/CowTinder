import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    data:[
  { file: {name:"file_8.xls"}, date: "21.11.2024", id: 1 },
  { file: {name:"file_9.xls"}, date: "22.11.2024", id: 2 },
  { file: {name:"file_10.xls"}, date: "23.11.2024", id: 3 },
  { file: {name:"file_11.xls"}, date: "24.11.2024",id: 4 },
  { file: {name:"file_12.xls"}, date: "25.11.2024", id: 5 },
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
    addFile: (state, action) => {
      const newFile = {
        file: { name: action.payload.name }, // Имя загруженного файла
        date: new Date().toLocaleDateString(), // Текущая дата
        id: state.data.length + 1, // Генерация ID
      };
      state.data.push(newFile);
    },
  },
});

export const { toggleActive, addFile } = passSlice.actions;
export default passSlice.reducer;
