import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const sendPassData = createAsyncThunk(
  'passSlice/sendPassData',
  async (targetDirection, { getState, rejectWithValue }) => {
    try {
      // Маппинг между русскими и английскими значениями
      const directionMap = {
        "Удойная особь": "milk",
        "Мясная особь": "meat",
        "Удойная или мясная особь": "combined"
      };

      // Преобразуем входной параметр на русском в английское значение
      const direction = directionMap[targetDirection];
      
      if (!direction) {
        throw new Error("Неизвестный тип цели.");
      }

      // Получаем currentSendElem из состояния
      const state = getState();
      const currentSendElem = state.pass.currentSendElem;

      if (!currentSendElem) {
        throw new Error("Нет данных для отправки.");
      }

      // Деструктурируем и исключаем поля id и createDate
      const { id, createDate, ...dataToSend } = currentSendElem;

      // Выполняем POST-запрос с телом запроса
      const response = await axios.post(
        `https://agro.itatmisis.ru/api/calculate_offspring?type=purebred&direction=${direction}`,
        dataToSend
      );

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
  currentSendElem: null,
  loading: false,
  error: false
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
      state.data = [action.payload, ...state.data];
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
        const person = { ...state.currentSendElem };

        const updatedData = action.payload.map(item => {
          return {
            ...item,
            udoi: (person.milk_yield_day + item.milk_yield_day) / 2,
            upitonost: Math.ceil((person.body_condition + item.body_condition) / 2),
            genballs: (person.genetic_value + item.genetic_value) / 2,
            healthy: (person.health_score + item.health_score) / 2,
            inbreedings: (person.inbreeding_coefficient + item.inbreeding_coefficient) / 2,
            fertl: (person.fertility_percentage + item.fertility_percentage) / 2,
            prirost: (person.weight_gain_day + item.weight_gain_day) / 2,
          };
        });

        // Формируем новый элемент истории
        const newHistoryItem = { data: updatedData.slice(0, 7), id, loadDate, person };

        // Добавляем новый элемент и оставляем только последние 5 записей
        state.history = [newHistoryItem, ...state.history];

        // Сохраняем историю в localStorage
        localStorage.setItem("history", JSON.stringify(state.history));
      })      
      .addCase(sendPassData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload; // Сохраняем сообщение об ошибке
      });
  }  
});

export const { toggleActive, addPass, setSend } = passSlice.actions;
export default passSlice.reducer;
