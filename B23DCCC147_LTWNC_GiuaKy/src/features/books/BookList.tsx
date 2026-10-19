import React from 'react';
import { Book } from '../../types/book';
import { BookItem } from './BookItem';

interface BookListProps {
  books: Book[];
  onBorrow: (bookId: string) => void;
}

export const BookList: React.FC<BookListProps> = ({ books, onBorrow }) => {
  if (books.length === 0) {
    return (
      <div className="empty-state">
        <p>Không tìm thấy cuốn sách nào phù hợp với yêu cầu tìm kiếm.</p>
      </div>
    );
  }

  return (
    <div className="book-grid">
      {books.map((book) => (
        // Bắt buộc dùng id duy nhất làm key, không dùng index
        <BookItem key={book.id} book={book} onBorrow={onBorrow} />
      ))}
    </div>
  );
};

