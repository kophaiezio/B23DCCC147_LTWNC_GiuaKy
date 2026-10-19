import { renderHook, act } from '@testing-library/react';
import { useDebounce } from '../hooks/useDebounce';

describe('useDebounce Custom Hook Tests', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  test('Trì hoãn việc cập nhật giá trị cho đến khi hết thời gian debounce (300ms)', () => {
    const { result, rerender } = renderHook(
      ({ value, delay }: { value: string; delay: number }) =>
        useDebounce<string>(value, delay),
      {
        initialProps: { value: 'react', delay: 300 },
      }
    );

    // Giá trị ban đầu đúng
    expect(result.current).toBe('react');

    // Thay đổi props truyền vào (người dùng gõ thêm chữ)
    rerender({ value: 'react-redux', delay: 300 });

    // Khi chưa đủ 300ms (mới trôi qua 150ms), giá trị debounced vẫn giữ nguyên giá trị cũ
    act(() => {
      jest.advanceTimersByTime(150);
    });
    expect(result.current).toBe('react');

    // Tiến thêm 150ms nữa (tổng 300ms), giá trị mới được cập nhật
    act(() => {
      jest.advanceTimersByTime(150);
    });
    expect(result.current).toBe('react-redux');
  });
});

