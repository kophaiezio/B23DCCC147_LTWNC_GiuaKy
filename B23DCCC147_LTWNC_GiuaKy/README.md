# Mini Library - Ứng dụng tra cứu và mượn/trả sách

Dự án bài thi giữa kỳ môn **Lập trình Web Nâng Cao** (Mã sinh viên: **B23DCCC147**).

Ứng dụng web Single Page Application (SPA) xây dựng bằng **React**, **TypeScript**, kết hợp các giải pháp quản lý state chuyên nghiệp: **Redux Toolkit**, **Zustand**, **Context API**, tối ưu hiệu năng với các React Performance Hooks và kiểm thử tự động với **Jest & React Testing Library**.

---

## 1. Công nghệ & Thư viện sử dụng

- **React 18 & TypeScript (v4.9.5/v5.x)**: Type-safe 100%, không sử dụng `any`.
- **Redux Toolkit (`@reduxjs/toolkit` & `react-redux`)**: Quản lý state danh sách sách và sách đang mượn. Tự viết custom Redux Middleware để chặn mượn quá 3 cuốn.
- **Zustand (`zustand`)**: Quản lý state độc lập của bộ lọc tìm kiếm và phân loại thể loại sách.
- **React Context API**: Quản lý Theme Sáng / Tối (Light / Dark mode) với màu sắc trung tính tối giản, memoize value với `useMemo` và custom hook `useTheme`.
- **React Router DOM (`react-router-dom` v6)**: Điều hướng giữa Trang chủ (`/`) và Trang thống kê (`/stats`).
- **Tối ưu hiệu năng**: `React.memo`, `useMemo`, `useCallback`, `React.lazy`, `<Suspense>`.
- **Kiểm thử**: Jest, React Testing Library, `@testing-library/user-event` với đầy đủ test cases cho Reducer, Component UI và Custom Hook.

---

## 2. Cấu trúc thư mục

```text
B23DCCC147_LTWNC_GiuaKy/
├── public/
│   └── index.html
├── src/
│   ├── api/
│   │   └── booksApi.ts             # Mock API với delay 500ms & hỗ trợ test case lỗi
│   ├── app/
│   │   └── store.ts                # Redux Store, đăng ký middleware và typed hooks
│   ├── context/
│   │   └── ThemeContext.tsx        # Context API quản lý Theme Sáng/Tối & hook useTheme
│   ├── features/
│   │   └── books/
│   │       ├── booksSlice.ts       # Redux Slice, createAsyncThunk, borrowLimitMiddleware
│   │       ├── BookItem.tsx        # Component hiển thị 1 cuốn sách (React.memo + Pick)
│   │       ├── BookList.tsx        # Danh sách sách render với key duy nhất
│   │       └── BorrowedList.tsx    # Danh sách sách đang mượn kèm thao tác trả sách
│   ├── hooks/
│   │   └── useDebounce.ts          # Generic hook useDebounce<T> (delay 300ms)
│   ├── pages/
│   │   ├── Home.tsx                # Trang chủ: tìm kiếm, lọc, danh sách, mượn/trả sách
│   │   └── Stats.tsx               # Trang thống kê (Lazy loaded): số lượng theo thể loại
│   ├── store/
│   │   └── filterStore.ts          # Zustand store cho từ khóa tìm kiếm & thể loại
│   ├── types/
│   │   └── book.ts                 # Types/Interfaces, Generic ApiResponse, Type Guards, Utility Types
│   ├── __tests__/
│   │   ├── booksSlice.test.ts      # 5 test cases cho Redux Reducer
│   │   ├── BookItem.test.tsx       # 3 test cases cho UI component (RTL + userEvent)
│   │   ├── useDebounce.test.ts     # 1 test case cho custom hook (Jest fake timers)
│   │   └── borrowLimitMiddleware.test.ts # 2 test cases cho Redux Middleware
│   ├── App.css / index.css         # Phong cách CSS tối giản, hỗ trợ Light/Dark mode
│   ├── App.tsx                     # Định tuyến, Lazy load, Suspense và Layout
│   ├── index.tsx                   # Điểm khởi chạy bọc Redux Provider & ThemeProvider
│   ├── react-app-env.d.ts
│   └── setupTests.ts
├── package.json
└── tsconfig.json
```

---

## 3. Các kỹ thuật nổi bật

### TypeScript nâng cao
1. **Generic API Response**:
   `ApiResponse<T> = { ok: true; data: T } | { ok: false; error: string }`
2. **Type Guards**:
   - `isSuccessResponse<T>(res): res is { ok: true; data: T }`
   - `isErrorResponse<T>(res): res is { ok: false; error: string }`
3. **Utility Types**:
   - `Omit<Book, 'availableCopies'>`: Tạo kiểu `BorrowedBook` loại bỏ thuộc tính số bản còn lại và bổ sung ngày mượn.
   - `Pick<Book, ...>`: Thu hẹp props cho `BookItemData`.
   - `Record<BookCategory, number>`: Bảng đếm số lượng sách theo từng thể loại tại trang thống kê.
   - `Partial<...>`: Bộ tiêu chí lọc.

### Redux Middleware giới hạn mượn sách
Đoạn middleware chặn action mượn khi sinh viên đã mượn $\ge 3$ cuốn:
```typescript
export const borrowLimitMiddleware: Middleware = (storeApi) => (next) => (action: unknown) => {
  if (borrowBook.match(action)) {
    const state = storeApi.getState() as { books: BooksState };
    if (state.books.borrowedBooks.length >= 3) {
      alert('Mỗi sinh viên chỉ được mượn tối đa 3 cuốn cùng lúc!');
      return; // Chặn action tại middleware, không chuyển tiếp tới reducer
    }
  }
  return next(action);
};
```

---

## 4. Hướng dẫn chạy và kiểm thử

### Khởi chạy dự án ở chế độ phát triển
```bash
# Cách 1: Chạy từ thư mục gốc
npm start

# Cách 2: Chạy trực tiếp trong thư mục dự án
cd B23DCCC147_LTWNC_GiuaKy
npm start
```
Ứng dụng sẽ mở tại `http://localhost:3000`.

### Chạy Unit Test
```bash
# Cách 1: Chạy từ thư mục gốc
npm test

# Cách 2: Chạy trực tiếp trong thư mục dự án
cd B23DCCC147_LTWNC_GiuaKy
npm test
```
Tất cả 4 Test Suites và 11 Test Cases đều đạt kết quả PASS (100%).

