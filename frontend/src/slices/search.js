import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  activeElem: {},
};

const searchSlice = createSlice({
  name: 'searchSlice',
  initialState,
  reducers: {
    setActive: (state, action) => {
      state.activeElem = action.payload;
    },
    setFile: (state, action) => {
      if (state.activeElem) {
        state.activeElem.file = action.payload; // Устанавливаем файл в активный элемент
      }
    },
  },
});

export const { setActive, setFile } = searchSlice.actions;
export default searchSlice.reducer;
