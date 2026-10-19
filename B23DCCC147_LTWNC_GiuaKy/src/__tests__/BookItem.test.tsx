import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BookItem } from '../features/books/BookItem';
import { Book } from '../types/book';

describe('BookItem Component Tests (React Testing Library + userEvent)', () => {
  const mockBook: Book = {
    id: 'book-101',
    title: 'Học React và TypeScript',
    author: 'Nguyễn Văn Test',
    category: 'CNTT',
    publishedYear: 2024,
    availableCopies: 5,
  };

  const mockOutOfStockBook: Book = {
    id: 'book-102',
    title: 'Kinh Tế Lượng Ứng Dụng',
    author: 'Trần Thị Hết Sách',
    category: 'Kinh tế',
    publishedYear: 2022,
    availableCopies: 0,
  };

  // Test case 1: Hiển thị đầy đủ thông tin sách
  test('Case 1: Hiển thị đúng thông tin sách (tên, tác giả, thể loại, năm XB, số bản)', () => {
    const handleBorrow = jest.fn();

    render(<BookItem book={mockBook} onBorrow={handleBorrow} />);

    // Kiểm tra tên sách
    expect(screen.getByText('Học React và TypeScript')).toBeInTheDocument();
    // Kiểm tra thể loại badge
    expect(screen.getByText('CNTT')).toBeInTheDocument();
    // Kiểm tra tác giả
    expect(screen.getByText(/Nguyễn Văn Test/i)).toBeInTheDocument();
    // Kiểm tra năm xuất bản
    expect(screen.getByText(/2024/i)).toBeInTheDocument();
    // Kiểm tra số bản còn lại
    expect(screen.getByText('5')).toBeInTheDocument();
  });

  // Test case 2: Click nút "Mượn" gọi đúng hàm với id tương ứng
  test('Case 2: Click nút "Mượn" gọi đúng callback onBorrow với id sách', async () => {
    const user = userEvent.setup();
    const handleBorrow = jest.fn();

    render(<BookItem book={mockBook} onBorrow={handleBorrow} />);

    const borrowButton = screen.getByRole('button', { name: /mượn/i });
    expect(borrowButton).toBeEnabled();

    // Người dùng click vào nút Mượn
    await user.click(borrowButton);

    // Kiểm tra hàm onBorrow được gọi đúng 1 lần và truyền đúng book.id
    expect(handleBorrow).toHaveBeenCalledTimes(1);
    expect(handleBorrow).toHaveBeenCalledWith('book-101');
  });

  // Test case 3: Nút "Mượn" bị disabled khi sách đã hết bản (availableCopies = 0)
  test('Case 3: Nút "Mượn" bị vô hiệu hoá (disabled) khi số bản còn lại bằng 0', async () => {
    const user = userEvent.setup();
    const handleBorrow = jest.fn();

    render(<BookItem book={mockOutOfStockBook} onBorrow={handleBorrow} />);

    // Kiểm tra chữ "Hết sách" hoặc nút bị disabled
    const borrowButton = screen.getByRole('button', { name: /mượn sách/i });
    expect(borrowButton).toBeDisabled();
    expect(borrowButton).toHaveTextContent('Hết sách');

    // Cố gắng click vào nút disabled
    await user.click(borrowButton);

    // Hàm callback không được gọi
    expect(handleBorrow).not.toHaveBeenCalled();
  });
});

