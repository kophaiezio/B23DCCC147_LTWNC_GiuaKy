import { useState, useEffect } from 'react';

/**
 * Custom hook generic để debounce bất kỳ giá trị nào sau một khoảng thời gian trễ.
 * @param value Giá trị đầu vào cần debounce
 * @param delay Thời gian trễ tính bằng mili-giây (VD: 300ms)
 * @returns Giá trị đã được debounce
 */
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    // Đặt hẹn giờ để cập nhật giá trị sau thời gian trễ
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Hủy hẹn giờ nếu value hoặc delay thay đổi (tránh trigger thừa)
    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}

