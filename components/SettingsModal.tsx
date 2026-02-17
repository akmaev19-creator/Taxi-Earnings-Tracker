
import React, { useState } from 'react';
import { Theme, themes } from '../hooks/useTheme';

const TermsModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50" onClick={onClose}>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg max-w-lg w-full m-4 space-y-4 text-slate-700 dark:text-slate-300" onClick={e => e.stopPropagation()}>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">Правила Пользования</h2>
                <div className="space-y-3 overflow-y-auto max-h-[60vh] pr-2">
                    <p className="text-sm">1. **Хранение данных:** Все данные хранятся исключительно локально в вашем браузере. Данные не отправляются на серверы и доступны только вам.</p>
                    <p className="text-sm">2. **Ответственность:** Вы несете полную ответственность за сохранность данных. Разработчик не несет ответственности за потерю данных при очистке кэша браузера.</p>
                    <p className="text-sm">3. **Отсутствие гарантий:** Приложение предоставляется "как есть".</p>
                </div>
                <button onClick={onClose} className="w-full mt-4 bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg transition-colors shadow-lg">
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
    defaultRent: number;
    onDefaultRentChange: (val: number) => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose, currentTheme, onThemeChange, defaultRent, onDefaultRentChange }) => {
    const [isTermsVisible, setIsTermsVisible] = useState(false);

    if (!isOpen) return null;

    return (
        <>
            <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-40 px-4" onClick={onClose}>
                <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl max-w-sm w-full space-y-6 shadow-2xl" onClick={e => e.stopPropagation()}>
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white border-b border-gray-100 dark:border-gray-700 pb-2">Настройки</h2>
                    
                    <div>
                        <h3 className="text-sm font-bold uppercase tracking-wider mb-3 text-slate-500 dark:text-slate-400">Тема оформления</h3>
                        <div className="flex space-x-2">
                            {themes.map(theme => (
                                <button
                                    key={theme.id}
                                    onClick={() => onThemeChange(theme.id)}
                                    className={`w-full py-2 rounded-xl font-semibold border-2 transition-all ${
                                        currentTheme === theme.id 
                                        ? 'border-green-500 text-green-600 bg-green-50 dark:bg-green-900/20' 
                                        : 'border-transparent bg-gray-100 dark:bg-gray-700 text-slate-700 dark:text-slate-300'
                                    }`}
                                >
                                    {theme.name}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div>
                        <h3 className="text-sm font-bold uppercase tracking-wider mb-3 text-slate-500 dark:text-slate-400">Аренда по умолчанию</h3>
                        <div className="relative">
                            <input 
                                type="number" 
                                value={defaultRent === 0 ? '' : defaultRent} 
                                onChange={(e) => onDefaultRentChange(e.target.value === '' ? 0 : Number(e.target.value))}
                                className="w-full bg-gray-100 dark:bg-gray-700 text-slate-900 dark:text-slate-100 px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-green-500 outline-none"
                                placeholder="Напр. 2500"
                            />
                            <span className="absolute right-3 top-2 text-slate-400 font-bold">₽</span>
                        </div>
                        <p className="text-xs text-slate-500 mt-2">Будет автоматически подставляться в новые смены.</p>
                    </div>

                    <div className="pt-2">
                         <h3 className="text-sm font-bold uppercase tracking-wider mb-3 text-slate-500 dark:text-slate-400">Поддержка</h3>
                        <a href="https://tips.yandex.ru/guest/payment/6618450" target="_blank" rel="noopener noreferrer" className="block w-full text-center bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-xl transition-all shadow-md">
                            Поддержать разработчика
                        </a>
                    </div>
                    
                    <div className="text-center pt-2">
                        <button onClick={() => setIsTermsVisible(true)} className="text-xs font-semibold text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors uppercase tracking-widest">
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
