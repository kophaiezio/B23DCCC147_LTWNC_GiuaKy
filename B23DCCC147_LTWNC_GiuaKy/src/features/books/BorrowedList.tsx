import React from 'react';
import { BorrowedBook } from '../../types/book';

interface BorrowedListProps {
  borrowedBooks: BorrowedBook[];
  onReturn: (bookId: string) => void;
}

export const BorrowedList: React.FC<BorrowedListProps> = ({
  borrowedBooks,
  onReturn,
}) => {
  return (
    <section className="borrowed-section">
      <div className="section-header">
        <h2>Sách đang mượn ({borrowedBooks.length}/3 cuốn)</h2>
      </div>

      {borrowedBooks.length === 0 ? (
        <p className="text-muted">Bạn chưa mượn cuốn sách nào.</p>
      ) : (
        <ul className="borrowed-list">
          {borrowedBooks.map((book) => (
            <li key={book.id} className="borrowed-item">
              <div className="borrowed-info">
                <strong>{book.title}</strong>
                <span className="text-secondary">
                  ({book.category}) - Ngày mượn: {book.borrowedAt}
                </span>
              </div>
              <button
                className="btn btn-secondary"
                onClick={() => onReturn(book.id)}
                aria-label={`Trả sách ${book.title}`}
              >
                Trả sách
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
};

