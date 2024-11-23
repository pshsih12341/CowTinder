import { configureStore } from '@reduxjs/toolkit';
import pass from '../slices/pass';
import history from "../slices/history";
import search from "../slices/search";

const store = configureStore({
  reducer: {
    pass: pass,
    history:history,
    search:search // Добавьте сюда все редьюсеры
  },
});

export default store;
