import { createSlice, createAsyncThunk, PayloadAction, Middleware } from '@reduxjs/toolkit';
import { Book, BorrowedBook, isSuccessResponse } from '../../types/book';
import { fetchBooksApi } from '../../api/booksApi';

// Trạng thái của Redux Slice sách
export interface BooksState {
  items: Book[];
  borrowedBooks: BorrowedBook[];
  loading: boolean;
  error: string | null;
}

const initialState: BooksState = {
  items: [],
  borrowedBooks: [],
  loading: false,
  error: null,
};

// Async thunk gọi Mock API lấy danh sách sách
export const fetchBooks = createAsyncThunk<
  Book[],
  boolean | undefined,
  { rejectValue: string }
>('books/fetchBooks', async (shouldFail = false, { rejectWithValue }) => {
  const response = await fetchBooksApi(shouldFail);

  // Áp dụng Type Guard isSuccessResponse đã tạo
  if (isSuccessResponse(response)) {
    return response.data;
  } else {
    return rejectWithValue(response.error);
  }
});

export const booksSlice = createSlice({
  name: 'books',
  initialState,
  reducers: {
    // Action mượn sách: giảm số bản còn lại và thêm vào danh sách đang mượn
    borrowBook: (state, action: PayloadAction<string>) => {
      const bookId = action.payload;
      const targetBook = state.items.find((b) => b.id === bookId);

      if (targetBook && targetBook.availableCopies > 0) {
        targetBook.availableCopies -= 1;

        // Sử dụng Omit thông qua destructuring
        const { availableCopies, ...bookData } = targetBook;
        const borrowedItem: BorrowedBook = {
          ...bookData,
          borrowedAt: new Date().toLocaleDateString('vi-VN'),
        };

        state.borrowedBooks.push(borrowedItem);
      }
    },
    // Action trả sách: tăng số bản còn lại và loại bỏ khỏi danh sách đang mượn
    returnBook: (state, action: PayloadAction<string>) => {
      const bookId = action.payload;
      const borrowedIndex = state.borrowedBooks.findIndex((b) => b.id === bookId);

      if (borrowedIndex !== -1) {
        state.borrowedBooks.splice(borrowedIndex, 1);

        const targetBook = state.items.find((b) => b.id === bookId);
        if (targetBook) {
          targetBook.availableCopies += 1;
        }
      }
    },
  },
  extraReducers: (builder) => {
    // Xử lý 3 trạng thái của createAsyncThunk: pending, fulfilled, rejected
    builder
      .addCase(fetchBooks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBooks.fulfilled, (state, action: PayloadAction<Book[]>) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchBooks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Không thể tải danh sách sách!';
      });
  },
});

export const { borrowBook, returnBook } = booksSlice.actions;

// ==========================================
// YÊU CẦU: REDUX MIDDLEWARE CHẶN MƯỢN > 3 CUỐN
// ==========================================
export const borrowLimitMiddleware: Middleware = (storeApi) => (next) => (action: unknown) => {
  // Kiểm tra nếu action là borrowBook
  if (borrowBook.match(action)) {
    const state = storeApi.getState() as { books: BooksState };
    const currentBorrowedCount = state.books.borrowedBooks.length;

    // Giới hạn tối đa 3 cuốn
    if (currentBorrowedCount >= 3) {
      alert('Mỗi sinh viên chỉ được mượn tối đa 3 cuốn cùng lúc!');
      // Chặn action, không chuyển tiếp qua reducer
      return;
    }
  }

  return next(action);
};

export default booksSlice.reducer;

