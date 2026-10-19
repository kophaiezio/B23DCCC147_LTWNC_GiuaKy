import { configureStore } from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import booksReducer, { borrowLimitMiddleware } from '../features/books/booksSlice';

export const store = configureStore({
  reducer: {
    books: booksReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(borrowLimitMiddleware),
});

// Định nghĩa RootState và AppDispatch từ chính Store
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Typed hooks cho toàn ứng dụng
export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

