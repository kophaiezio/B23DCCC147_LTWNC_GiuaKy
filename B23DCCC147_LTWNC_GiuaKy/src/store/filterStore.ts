import { create } from 'zustand';
import { BookCategory } from '../types/book';

export type CategoryFilter = 'Tất cả' | BookCategory;

export interface FilterState {
  searchTerm: string;
  selectedCategory: CategoryFilter;
  setSearchTerm: (term: string) => void;
  setSelectedCategory: (category: CategoryFilter) => void;
  resetFilter: () => void;
}

// Zustand store quản lý trạng thái tìm kiếm và bộ lọc thể loại
export const useFilterStore = create<FilterState>((set) => ({
  searchTerm: '',
  selectedCategory: 'Tất cả',
  setSearchTerm: (term: string) => set({ searchTerm: term }),
  setSelectedCategory: (category: CategoryFilter) => set({ selectedCategory: category }),
  resetFilter: () => set({ searchTerm: '', selectedCategory: 'Tất cả' }),
}));

