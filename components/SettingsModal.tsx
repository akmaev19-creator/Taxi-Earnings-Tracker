
import React, { useState } from 'react';
import { Theme, themes } from '../hooks/useTheme';

const TermsModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50" onClick={onClose}>
            <div className="bg-white dark:bg-gray-800 theme-cyber:bg-cyber-bg p-6 rounded-lg max-w-lg w-full m-4 space-y-4 text-slate-700 dark:text-slate-300 theme-cyber:text-cyber-text theme-cyber:border theme-cyber:border-cyber-primary/50" onClick={e => e.stopPropagation()}>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white theme-cyber:text-cyber-secondary">Правила Пользования</h2>
                <p className="text-sm">1. **Хранение данных:** Все данные, которые вы вводите в это приложение (информация о сменах, доходах, расходах), хранятся исключительно локально в вашем браузере. Данные не отправляются на какие-либо серверы и доступны только вам на том устройстве, где вы их ввели.</p>
                <p className="text-sm">2. **Ответственность:** Вы несете полную ответственность за сохранность и точность введенных данных. Разработчик не несет ответственности за потерю данных, например, при очистке кэша браузера или смене устройства.</p>
                <p className="text-sm">3. **Отсутствие гарантий:** Приложение предоставляется "как есть". Разработчик не гарантирует его безошибочную работу и не несет ответственности за любые прямые или косвенные убытки, возникшие в результате его использования.</p>
                <button onClick={onClose} className="w-full mt-4 bg-green-600 hover:bg-green-700 text-white theme-cyber:bg-cyber-primary theme-cyber:hover:bg-pink-600 font-bold py-2 px-4 rounded-lg transition-colors">
                    Понятно
                </button>
            </div>
        </div>
    );
};


interface SettingsModalProps {
    isOpen: boolean;
    onClose: () => void;
    currentTheme: Theme;
    onThemeChange: (theme: Theme) => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose, currentTheme, onThemeChange }) => {
    const [isTermsVisible, setIsTermsVisible] = useState(false);

    if (!isOpen) return null;

    return (
        <>
            <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-40" onClick={onClose}>
                <div className="bg-white dark:bg-gray-800 theme-cyber:bg-cyber-bg p-6 rounded-lg max-w-sm w-full m-4 space-y-6 theme-cyber:border theme-cyber:border-cyber-primary/50" onClick={e => e.stopPropagation()}>
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white theme-cyber:text-cyber-secondary">Настройки</h2>
                    
                    <div>
                        <h3 className="text-lg font-semibold mb-3 text-slate-800 dark:text-slate-200 theme-cyber:text-cyber-text">Тема оформления</h3>
                        <div className="flex space-x-2">
                            {themes.map(theme => (
                                <button
                                    key={theme.id}
                                    onClick={() => onThemeChange(theme.id)}
                                    className={`w-full py-2 rounded-lg font-semibold border-2 transition-colors ${
                                        currentTheme === theme.id 
                                        ? 'border-green-500 theme-cyber:border-cyber-primary text-green-600 theme-cyber:text-cyber-primary' 
                                        : 'border-transparent bg-gray-200 dark:bg-gray-700 theme-cyber:bg-gray-900/50 text-slate-700 dark:text-slate-300 theme-cyber:text-cyber-text'
                                    }`}
                                >
                                    {theme.name}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div>
                         <h3 className="text-lg font-semibold mb-3 text-slate-800 dark:text-slate-200 theme-cyber:text-cyber-text">Помощь проекту</h3>
                        <a href="https://tips.yandex.ru/guest/payment/6618450" target="_blank" rel="noopener noreferrer" className="block w-full text-center bg-green-600 hover:bg-green-700 text-white theme-cyber:bg-cyber-primary theme-cyber:hover:bg-pink-600 font-bold py-3 px-4 rounded-lg transition-colors">
                            Поддержать разработчика
                        </a>
                    </div>
                    
                    <div className="text-center">
                        <button onClick={() => setIsTermsVisible(true)} className="text-sm text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 theme-cyber:text-cyber-secondary theme-cyber:hover:text-cyber-primary transition-colors">
                            Правила пользования
                        </button>
                    </div>

                </div>
            </div>
            {isTermsVisible && <TermsModal onClose={() => setIsTermsVisible(false)} />}
        </>
    );
};

export default SettingsModal;
