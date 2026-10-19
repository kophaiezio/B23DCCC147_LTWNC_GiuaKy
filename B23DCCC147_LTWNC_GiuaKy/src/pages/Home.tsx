import React, { useEffect, useMemo, useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '../app/store';
import { fetchBooks, borrowBook, returnBook } from '../features/books/booksSlice';
import { useFilterStore, CategoryFilter } from '../store/filterStore';
import { useDebounce } from '../hooks/useDebounce';
import { BookList } from '../features/books/BookList';
import { BorrowedList } from '../features/books/BorrowedList';
import { BookCategory } from '../types/book';

const CATEGORIES: CategoryFilter[] = ['Tất cả', 'CNTT', 'Kinh tế', 'Ngoại ngữ'];

export const Home: React.FC = () => {
  const dispatch = useAppDispatch();
  const { items: books, borrowedBooks, loading, error } = useAppSelector(
    (state) => state.books
  );

  // Zustand Store cho bộ lọc tìm kiếm và thể loại
  const { searchTerm, selectedCategory, setSearchTerm, setSelectedCategory } =
    useFilterStore();

  // Áp dụng custom hook useDebounce 300ms cho ô tìm kiếm
  const debouncedSearchTerm = useDebounce<string>(searchTerm, 300);

  // Gọi API lấy sách khi khởi động (chỉ gọi 1 lần ban đầu nếu chưa có sách)
  useEffect(() => {
    if (books.length === 0 && !error) {
      dispatch(fetchBooks());
    }
  }, [dispatch, books.length, error]);

  // Bắt buộc dùng useCallback cho hàm handler mượn sách truyền xuống component con
  const handleBorrow = useCallback(
    (bookId: string) => {
      dispatch(borrowBook(bookId));
    },
    [dispatch]
  );

  // Bắt buộc dùng useCallback cho hàm handler trả sách truyền xuống component con
  const handleReturn = useCallback(
    (bookId: string) => {
      dispatch(returnBook(bookId));
    },
    [dispatch]
  );

  // Bắt buộc dùng useMemo để tính toán danh sách sách sau khi lọc
  const filteredBooks = useMemo(() => {
    const cleanSearch = debouncedSearchTerm.toLowerCase().trim();

    return books.filter((book) => {
      // Lọc theo thể loại
      const matchesCategory =
        selectedCategory === 'Tất cả' ||
        book.category === (selectedCategory as BookCategory);

      // Tìm kiếm không phân biệt hoa thường theo tên sách hoặc tác giả
      const matchesSearch =
        cleanSearch === '' ||
        book.title.toLowerCase().includes(cleanSearch) ||
        book.author.toLowerCase().includes(cleanSearch);

      return matchesCategory && matchesSearch;
    });
  }, [books, debouncedSearchTerm, selectedCategory]);

  return (
    <div className="home-container">
      {/* Bộ lọc và Tìm kiếm */}
      <section className="filter-section">
        <div className="search-box">
          <label htmlFor="search-input" className="form-label">
            Tìm kiếm sách:
          </label>
          <input
            id="search-input"
            type="text"
            className="input-text"
            placeholder="Nhập tên sách hoặc tác giả..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="category-filter">
          <span className="form-label">Thể loại:</span>
          <div className="category-buttons">
            {CATEGORIES.map((category) => (
              <button
                key={category}
                type="button"
                className={`btn btn-chip ${
                  selectedCategory === category ? 'active' : ''
                }`}
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Hiển thị trạng thái Đang tải... */}
      {loading && (
        <div className="loading-state">
          <p>Đang tải...</p>
        </div>
      )}

      {/* Hiển thị thông báo lỗi rõ ràng nếu API thất bại */}
      {error && !loading && (
        <div className="error-state">
          <p className="error-message">Đã xảy ra lỗi: {error}</p>
          <button
            className="btn btn-primary"
            onClick={() => dispatch(fetchBooks(false))}
          >
            Thử lại
          </button>
        </div>
      )}

      {/* Danh sách sách khả dụng */}
      {!loading && !error && (
        <>
          <section className="books-section">
            <div className="section-header">
              <h2>Kho sách ({filteredBooks.length} cuốn phù hợp)</h2>
            </div>
            <BookList books={filteredBooks} onBorrow={handleBorrow} />
          </section>

          {/* Danh sách sách sinh viên đang mượn */}
          <BorrowedList
            borrowedBooks={borrowedBooks}
            onReturn={handleReturn}
          />
        </>
      )}
    </div>
  );
};

export default Home;

