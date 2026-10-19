import { configureStore } from '@reduxjs/toolkit';
import booksReducer, {
  borrowBook,
  borrowLimitMiddleware,
  BooksState,
} from '../features/books/booksSlice';

describe('borrowLimitMiddleware Tests', () => {
  // Giả lập window.alert
  let alertMock: jest.SpyInstance;

  beforeEach(() => {
    alertMock = jest.spyOn(window, 'alert').mockImplementation(() => {});
  });

  afterEach(() => {
    alertMock.mockRestore();
  });

  test('Cho phép mượn sách nếu số sách đang mượn < 3', () => {
    const store = configureStore({
      reducer: { books: booksReducer },
      middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(borrowLimitMiddleware),
      preloadedState: {
        books: {
          items: [
            {
              id: 'b1',
              title: 'Sách 1',
              author: 'Tác giả 1',
              category: 'CNTT',
              publishedYear: 2023,
              availableCopies: 2,
            },
          ],
          borrowedBooks: [],
          loading: false,
          error: null,
        } as BooksState,
      },
    });

    store.dispatch(borrowBook('b1'));

    expect(alertMock).not.toHaveBeenCalled();
    expect(store.getState().books.borrowedBooks).toHaveLength(1);
  });

  test('Chặn mượn sách và gọi alert cảnh báo khi đã mượn 3 cuốn', () => {
    const store = configureStore({
      reducer: { books: booksReducer },
      middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(borrowLimitMiddleware),
      preloadedState: {
        books: {
          items: [
            {
              id: 'b4',
              title: 'Sách 4',
              author: 'Tác giả 4',
              category: 'CNTT',
              publishedYear: 2023,
              availableCopies: 2,
            },
          ],
          borrowedBooks: [
            {
              id: 'b1',
              title: 'Sách 1',
              author: 'Tác giả 1',
              category: 'CNTT',
              publishedYear: 2021,
              borrowedAt: '19/10/2026',
            },
            {
              id: 'b2',
              title: 'Sách 2',
              author: 'Tác giả 2',
              category: 'Kinh tế',
              publishedYear: 2022,
              borrowedAt: '19/10/2026',
            },
            {
              id: 'b3',
              title: 'Sách 3',
              author: 'Tác giả 3',
              category: 'Ngoại ngữ',
              publishedYear: 2023,
              borrowedAt: '19/10/2026',
            },
          ],
          loading: false,
          error: null,
        } as BooksState,
      },
    });

    // Cố gắng mượn cuốn thứ 4
    store.dispatch(borrowBook('b4'));

    // Bị chặn và hiển thị alert
    expect(alertMock).toHaveBeenCalledWith(
      'Mỗi sinh viên chỉ được mượn tối đa 3 cuốn cùng lúc!'
    );

    // Số sách đang mượn vẫn giữ nguyên là 3, không tăng lên 4
    expect(store.getState().books.borrowedBooks).toHaveLength(3);
  });
});

