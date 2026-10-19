// Định nghĩa thể loại sách
export type BookCategory = 'CNTT' | 'Kinh tế' | 'Ngoại ngữ';

// Interface thực thể Sách trong thư viện
export interface Book {
  id: string;
  title: string;
  author: string;
  category: BookCategory;
  publishedYear: number;
  availableCopies: number;
}

// ==========================================
// YÊU CẦU: SỬ DỤNG UTILITY TYPES CỦA TYPESCRIPT
// ==========================================

// Utility Type 1: Omit - Tạo kiểu BorrowedBook bằng cách loại bỏ 'availableCopies' và thêm 'borrowedAt'
export type BorrowedBook = Omit<Book, 'availableCopies'> & {
  borrowedAt: string;
};

// Utility Type 2: Pick - Tạo kiểu dữ liệu tóm tắt sách cho props component hiển thị
export type BookSummary = Pick<Book, 'id' | 'title' | 'author' | 'category'>;

// Utility Type 3: Record - Dùng để định nghĩa bảng thống kê số lượng sách theo thể loại
export type CategoryCountRecord = Record<BookCategory, number>;

// Utility Type 4: Partial - Dùng cho các bộ lọc có thể cập nhật từng phần
export type FilterCriteria = Partial<{
  searchTerm: string;
  category: BookCategory | 'Tất cả';
}>;

// ==========================================
// YÊU CẦU: GENERIC API RESPONSE & TYPE GUARD
// ==========================================

// Kiểu Generic cho phản hồi từ API giả lập
export type ApiResponse<T> =
  | { ok: true; data: T }
  | { ok: false; error: string };

// Type Guard để kiểm tra và thu hẹp kiểu dữ liệu thành công
export function isSuccessResponse<T>(
  response: ApiResponse<T>
): response is { ok: true; data: T } {
  return response.ok === true;
}

// Type Guard để kiểm tra và thu hẹp kiểu dữ liệu thất bại
export function isErrorResponse<T>(
  response: ApiResponse<T>
): response is { ok: false; error: string } {
  return response.ok === false;
}

