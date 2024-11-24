import { createSlice } from '@reduxjs/toolkit';
import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const sendPassData = createAsyncThunk(
  'passSlice/sendPassData',
  async (_, { getState, rejectWithValue }) => {
    try {
      // Получаем currentSendElem из состояния
      const state = getState();
      const currentSendElem = state.pass.currentSendElem;

      if (!currentSendElem) {
        throw new Error("Нет данных для отправки.");
      }

      // Деструктурируем и исключаем поля id и createDate
      const { id, createDate, ...dataToSend } = currentSendElem;


      // Выполняем POST-запрос с телом запроса, передавая оставшиеся поля
      const response = await axios.post(`https://agro.itatmisis.ru/api/calculate_offspring?type=purebred&direction=milk`, dataToSend);

      // Возвращаем данные ответа
      return response.data;
    } catch (error) {
      // Обрабатываем ошибки
      return rejectWithValue(error.message);
    }
  }
);



const initialState = {
  data: JSON.parse(localStorage.getItem("passes")) || [],
  history: JSON.parse(localStorage.getItem("history")) || [],
  activeElem: null,
  currentSendElem:null,
  loading:false,
  error:false
};
const passSlice = createSlice({
  name: 'passSlice',
  initialState,
  reducers: {
    toggleActive: (state, action) => {
      const id = action.payload;
      state.activeElem = state.data.find(el => el.id === id);
    },
    addPass: (state, action) => {
      const id = state.data.length + 1;
      const createDate = new Date();
      action.payload = { ...action.payload, id, createDate };
      state.data = [action.payload,...state.data];
      localStorage.setItem("passes", JSON.stringify(state.data));
    },
    setSend: (state, action) => {
      const { direction, type } = action.payload;
      state.currentSendElem = { ...state.activeElem, direction, type };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(sendPassData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(sendPassData.fulfilled, (state, action) => {
        state.loading = false;
        const id = state.history?.length + 1;
        const loadDate = new Date();
        const person = {...state.currentSendElem};
        action.payload = {data:[...action.payload], id,loadDate,person}
        state.history = [action.payload,...state.history]; // Сохраняем успешный ответ
      })
      .addCase(sendPassData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload; // Сохраняем сообщение об ошибке
      });
  },
});


export const { toggleActive,addPass,setSend} = passSlice.actions;
export default passSlice.reducer;
