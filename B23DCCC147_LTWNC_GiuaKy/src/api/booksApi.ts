import { Book, ApiResponse } from '../types/book';

// Dữ liệu sách giả lập ban đầu
const INITIAL_BOOKS: Book[] = [
  // Thể loại: CNTT (5 cuốn)
  {
    id: 'b1',
    title: 'Clean Code - Nghệ thuật viết code sạch',
    author: 'Robert C. Martin',
    category: 'CNTT',
    publishedYear: 2021,
    availableCopies: 5,
  },
  {
    id: 'b2',
    title: 'Lập trình TypeScript từ con số 0',
    author: 'Mai Đức Anh',
    category: 'CNTT',
    publishedYear: 2023,
    availableCopies: 4,
  },
  {
    id: 'b3',
    title: 'Cấu trúc dữ liệu và giải thuật thực chiến',
    author: 'Trần Duy Hưng',
    category: 'CNTT',
    publishedYear: 2022,
    availableCopies: 3,
  },
  {
    id: 'b4',
    title: 'Thiết kế hệ thống phân tán cỡ lớn',
    author: 'Alex Xu',
    category: 'CNTT',
    publishedYear: 2023,
    availableCopies: 2,
  },
  {
    id: 'b5',
    title: 'Học ReactJS không khó',
    author: 'Cao Đức Duy',
    category: 'CNTT',
    publishedYear: 2024,
    availableCopies: 0, // Hết sách để kiểm tra nút Mượn bị disabled
  },

  // Thể loại: Kinh tế (5 cuốn)
  {
    id: 'b6',
    title: 'Lợi ích từ việc đầu tư',
    author: 'Robert Kiyosaki',
    category: 'Kinh tế',
    publishedYear: 2020,
    availableCopies: 4,
  },
  {
    id: 'b7',
    title: 'Tâm lý học về tiền',
    author: 'Morgan Housel',
    category: 'Kinh tế',
    publishedYear: 2022,
    availableCopies: 3,
  },
  {
    id: 'b8',
    title: 'Khởi nghiệp tinh gọn',
    author: 'Eric Ries',
    category: 'Kinh tế',
    publishedYear: 2021,
    availableCopies: 2,
  },
  {
    id: 'b9',
    title: 'Kinh tế vi mô nhập môn',
    author: 'Trương Ái Bình',
    category: 'Kinh tế',
    publishedYear: 2023,
    availableCopies: 3,
  },
  {
    id: 'b10',
    title: 'Chiến tranh tiền tệ',
    author: 'Đoàn Ngọc Thắng',
    category: 'Kinh tế',
    publishedYear: 2020,
    availableCopies: 1,
  },

  // Thể loại: Ngoại ngữ (5 cuốn)
  {
    id: 'b11',
    title: 'Hack não 1500 từ tiếng Anh',
    author: 'Nguyễn Hiệp',
    category: 'Ngoại ngữ',
    publishedYear: 2022,
    availableCopies: 4,
  },
  {
    id: 'b12',
    title: 'English for IT Specialists',
    author: 'David Evans',
    category: 'Ngoại ngữ',
    publishedYear: 2021,
    availableCopies: 3,
  },
  {
    id: 'b13',
    title: 'Luyện thi IELTS - Kỹ năng đọc hiểu cấp tốc',
    author: 'Dương Tuấn Kiệt',
    category: 'Ngoại ngữ',
    publishedYear: 2024,
    availableCopies: 2,
  },
  {
    id: 'b14',
    title: 'Tự học tiếng Nhật cấp tốc không nản',
    author: 'Lê Hoàng Nam',
    category: 'Ngoại ngữ',
    publishedYear: 2023,
    availableCopies: 3,
  },
  {
    id: 'b15',
    title: 'Tiếng Trung giao tiếp cho người đi làm',
    author: 'Trần Bích Ngọc',
    category: 'Ngoại ngữ',
    publishedYear: 2024,
    availableCopies: 2,
  },
];

/**
 * Mock API lấy danh sách sách từ server giả lập.
 * Độ trễ: 500ms
 * Trả về kiểu Generic ApiResponse<Book[]>
 * @param shouldFail Nếu truyền true, API sẽ giả lập lỗi kết nối
 */
export const fetchBooksApi = (
  shouldFail: boolean = false
): Promise<ApiResponse<Book[]>> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      if (shouldFail) {
        resolve({
          ok: false,
          error: 'Không thể kết nối đến máy chủ thư viện. Vui lòng thử lại sau!',
        });
      } else {
        // Trả về bản sao của danh sách sách
        resolve({
          ok: true,
          data: [...INITIAL_BOOKS],
        });
      }
    }, 500);
  });
};

