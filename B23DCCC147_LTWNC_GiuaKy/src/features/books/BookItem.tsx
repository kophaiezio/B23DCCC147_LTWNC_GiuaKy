import React from 'react';
import { Book } from '../../types/book';

// Sử dụng Utility Type Pick để xác định rõ các thuộc tính cần thiết từ Book
export type BookItemData = Pick<
  Book,
  'id' | 'title' | 'author' | 'category' | 'publishedYear' | 'availableCopies'
>;

export interface BookItemProps {
  book: BookItemData;
  onBorrow: (bookId: string) => void;
}

// Bắt buộc sử dụng React.memo để tối ưu hiệu năng tránh re-render không cần thiết
export const BookItem: React.FC<BookItemProps> = React.memo(({ book, onBorrow }) => {
  const isOutOfStock = book.availableCopies <= 0;

  return (
    <div className="book-card" data-testid={`book-item-${book.id}`}>
      <div className="book-card-header">
        <h3 className="book-title">{book.title}</h3>
        <span className="book-badge">{book.category}</span>
      </div>

      <div className="book-card-body">
        <p className="book-meta">
          <strong>Tác giả:</strong> {book.author}
        </p>
        <p className="book-meta">
          <strong>Năm xuất bản:</strong> {book.publishedYear}
        </p>
        <p className="book-meta">
          <strong>Số bản còn lại:</strong>{' '}
          <span
            className={`copies-count ${
              isOutOfStock ? 'copies-out' : 'copies-available'
            }`}
          >
            {book.availableCopies}
          </span>
        </p>
      </div>

      <div className="book-card-footer">
        <button
          className="btn btn-primary"
          onClick={() => onBorrow(book.id)}
          disabled={isOutOfStock}
          aria-label={`Mượn sách ${book.title}`}
        >
          {isOutOfStock ? 'Hết sách' : 'Mượn'}
        </button>
      </div>
    </div>
  );
});

BookItem.displayName = 'BookItem';

