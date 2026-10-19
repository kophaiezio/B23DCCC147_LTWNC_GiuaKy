import React, { createContext, useContext, useState, useMemo, ReactNode } from 'react';

export type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>('light');

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  // Bắt buộc dùng useMemo cho value truyền vào Provider theo yêu cầu
  const contextValue = useMemo<ThemeContextType>(() => {
    return {
      theme,
      toggleTheme,
    };
  }, [theme]);

  return (
    <ThemeContext.Provider value={contextValue}>
      <div className={`app-root theme-${theme}`}>{children}</div>
    </ThemeContext.Provider>
  );
};

// Custom hook useTheme để sử dụng theme trong các component
export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme phải được sử dụng bên trong ThemeProvider');
  }
  return context;
};

