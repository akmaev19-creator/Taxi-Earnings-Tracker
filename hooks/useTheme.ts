
import { useState, useEffect, useCallback } from 'react';

export type Theme = 'light' | 'dark' | 'cyber';

export const themes: { id: Theme; name: string }[] = [
    { id: 'light', name: 'Светлая' },
    { id: 'dark', name: 'Тёмная' },
    { id: 'cyber', name: 'Киберпанк' },
];

const useTheme = () => {
    const [theme, setThemeState] = useState<Theme>('dark');

    useEffect(() => {
        const storedTheme = localStorage.getItem('app-theme') as Theme;
        if (storedTheme && themes.some(t => t.id === storedTheme)) {
            setThemeState(storedTheme);
        } else {
             // Set default based on system preference
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            setThemeState(prefersDark ? 'dark' : 'light');
        }
    }, []);
    
    useEffect(() => {
        const root = window.document.documentElement;
        const body = window.document.body;
        
        root.classList.remove('light', 'dark');
        body.classList.remove('theme-cyber');

        if (theme === 'light') {
            root.classList.add('light');
        } else {
            root.classList.add('dark'); // Dark is the default for both dark and cyber themes at the root level
            if(theme === 'cyber'){
                body.classList.add('theme-cyber')
            }
        }
        
        localStorage.setItem('app-theme', theme);
    }, [theme]);

    const setTheme = useCallback((newTheme: Theme) => {
        setThemeState(newTheme);
    }, []);

    return { theme, setTheme };
};

export default useTheme;
