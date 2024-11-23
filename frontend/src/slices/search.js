import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  activeElem: null,
};

const searchSlice = createSlice({
  name: 'searchSlice',
  initialState,
  reducers: {
    setActive: (state, action) => {
      state.activeElem = action.payload;
    },
    setField: (state, action) => {
      const { field, value } = action.payload; // Деструктурируем поле и значение
      if (!state.activeElem) {
        state.activeElem = {}; // Если activeElem отсутствует, инициализируем пустой объект
      }
      state.activeElem[field] = value;
    },
  },
});

export const { setActive, setField } = searchSlice.actions;
export default searchSlice.reducer;
