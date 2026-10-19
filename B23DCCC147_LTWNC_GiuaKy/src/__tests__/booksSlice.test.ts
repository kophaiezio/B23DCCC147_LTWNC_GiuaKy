import booksReducer, {
  borrowBook,
  returnBook,
  fetchBooks,
  BooksState,
} from '../features/books/booksSlice';
import { Book } from '../types/book';

describe('booksSlice Reducer Tests', () => {
  const initialTestState: BooksState = {
    items: [
      {
        id: 'b1',
        title: 'Lập trình TypeScript',
        author: 'Nguyễn Văn A',
        category: 'CNTT',
        publishedYear: 2023,
        availableCopies: 2,
      },
      {
        id: 'b2',
        title: 'Kinh tế học cơ bản',
        author: 'Trần Văn B',
        category: 'Kinh tế',
        publishedYear: 2021,
        availableCopies: 1,
      },
    ],
    borrowedBooks: [],
    loading: false,
    error: null,
  };

  // Test case 1: Khởi tạo initial state đúng
  test('Case 1: Khởi tạo với initial state chính xác khi không truyền state', () => {
    const state = booksReducer(undefined, { type: 'unknown' });
    expect(state).toEqual({
      items: [],
      borrowedBooks: [],
      loading: false,
      error: null,
    });
  });

  // Test case 2: Xử lý fetchBooks.fulfilled cập nhật items
  test('Case 2: Cập nhật danh sách sách khi fetchBooks.fulfilled', () => {
    const mockBooks: Book[] = [
      {
        id: 'b10',
        title: 'React Nâng Cao',
        author: 'Lê Văn C',
        category: 'CNTT',
        publishedYear: 2024,
        availableCopies: 5,
      },
    ];

    const action = {
      type: fetchBooks.fulfilled.type,
      payload: mockBooks,
    };

    const state = booksReducer(initialTestState, action);
    expect(state.loading).toBe(false);
    expect(state.items).toHaveLength(1);
    expect(state.items[0].title).toBe('React Nâng Cao');
    expect(state.error).toBeNull();
  });

  // Test case 3: Xử lý borrowBook giảm availableCopies và thêm vào borrowedBooks
  test('Case 3: Xử lý borrowBook giảm số lượng sách trong kho và đưa vào danh sách mượn', () => {
    const stateAfterBorrow = booksReducer(initialTestState, borrowBook('b1'));

    // Cuốn b1 giảm từ 2 xuống 1
    const targetBook = stateAfterBorrow.items.find((b) => b.id === 'b1');
    expect(targetBook?.availableCopies).toBe(1);

    // Danh sách mượn tăng thêm 1 cuốn
    expect(stateAfterBorrow.borrowedBooks).toHaveLength(1);
    expect(stateAfterBorrow.borrowedBooks[0].id).toBe('b1');
    expect(stateAfterBorrow.borrowedBooks[0].title).toBe('Lập trình TypeScript');
    expect(stateAfterBorrow.borrowedBooks[0].borrowedAt).toBeDefined();
  });

  // Test case 4: Xử lý returnBook tăng availableCopies và loại khỏi borrowedBooks
  test('Case 4: Xử lý returnBook tăng số lượng sách trong kho và xóa khỏi danh sách mượn', () => {
    // Chuẩn bị state đã có 1 cuốn sách đang mượn
    const stateWithBorrow: BooksState = {
      items: [
        {
          id: 'b1',
          title: 'Lập trình TypeScript',
          author: 'Nguyễn Văn A',
          category: 'CNTT',
          publishedYear: 2023,
          availableCopies: 1, // đã bị giảm từ 2 xuống 1
        },
      ],
      borrowedBooks: [
        {
          id: 'b1',
          title: 'Lập trình TypeScript',
          author: 'Nguyễn Văn A',
          category: 'CNTT',
          publishedYear: 2023,
          borrowedAt: '19/10/2026',
        },
      ],
      loading: false,
      error: null,
    };

    const stateAfterReturn = booksReducer(stateWithBorrow, returnBook('b1'));

    // Cuốn b1 tăng từ 1 lên 2
    const targetBook = stateAfterReturn.items.find((b) => b.id === 'b1');
    expect(targetBook?.availableCopies).toBe(2);

    // Danh sách mượn trở về 0
    expect(stateAfterReturn.borrowedBooks).toHaveLength(0);
  });

  // Test case 5 (bổ sung): fetchBooks.rejected cập nhật error
  test('Case 5 (bổ sung): Xử lý fetchBooks.rejected cập nhật lỗi', () => {
    const action = {
      type: fetchBooks.rejected.type,
      payload: 'Lỗi mạng máy chủ',
    };

    const state = booksReducer(initialTestState, action);
    expect(state.loading).toBe(false);
    expect(state.error).toBe('Lỗi mạng máy chủ');
  });
});

