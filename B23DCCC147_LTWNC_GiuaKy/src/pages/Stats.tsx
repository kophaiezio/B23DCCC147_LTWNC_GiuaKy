import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useAppSelector } from '../app/store';
import { BookCategory, CategoryCountRecord } from '../types/book';

export const Stats: React.FC = () => {
  const { items: books, borrowedBooks } = useAppSelector((state) => state.books);

  // Tính toán số lượng đầu sách theo từng thể loại bằng useMemo và Utility Type CategoryCountRecord (Record<...>)
  const categoryStats = useMemo<CategoryCountRecord>(() => {
    const stats: CategoryCountRecord = {
      CNTT: 0,
      'Kinh tế': 0,
      'Ngoại ngữ': 0,
    };

    books.forEach((book) => {
      if (stats[book.category] !== undefined) {
        stats[book.category] += 1;
      }
    });

    return stats;
  }, [books]);

  // Tổng số sách hiện có trong kho
  const totalBooksInLibrary = useMemo(() => {
    return books.length;
  }, [books]);

  // Tổng số sách sinh viên đang mượn
  const totalBorrowedBooks = borrowedBooks.length;

  return (
    <div className="stats-container">
      <div className="stats-header">
        <h2>Thống kê thư viện</h2>
        <Link to="/" className="btn btn-secondary">
          &larr; Quay lại trang chủ
        </Link>
      </div>

      <div className="stats-summary-grid">
        <div className="stat-card stat-highlight">
          <span className="stat-label">Tổng sách sinh viên đang mượn</span>
          <span className="stat-value">{totalBorrowedBooks} / 3</span>
          <span className="stat-sub">
            {totalBorrowedBooks >= 3
              ? 'Đã đạt giới hạn mượn'
              : `Còn có thể mượn thêm ${3 - totalBorrowedBooks} cuốn`}
          </span>
        </div>

        <div className="stat-card">
          <span className="stat-label">Tổng đầu sách trong hệ thống</span>
          <span className="stat-value">{totalBooksInLibrary}</span>
          <span className="stat-sub">Đầu sách đang lưu hành</span>
        </div>
      </div>

      <div className="stats-category-section">
        <h3>Số lượng đầu sách theo từng thể loại</h3>
        <div className="stats-category-grid">
          {(Object.keys(categoryStats) as BookCategory[]).map((cat) => (
            <div key={cat} className="category-stat-box">
              <span className="category-name">{cat}</span>
              <span className="category-count">{categoryStats[cat]}</span>
              <span className="category-unit">đầu sách</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Stats;

