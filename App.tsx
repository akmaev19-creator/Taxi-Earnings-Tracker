
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Shift } from './types';
import Stats, { Period } from './components/Stats';
import ShiftList from './components/ShiftList';
import ShiftForm from './components/ShiftForm';
import { PlusIcon } from './components/icons/PlusIcon';
import PeriodDetail from './components/PeriodDetail';
import { isSameDay, getStartOfWeek, getStartOfMonth, getEndOfWeek, getEndOfMonth } from './utils/dateUtils';
import { SettingsIcon } from './components/icons/SettingsIcon';
import SettingsModal from './components/SettingsModal';
import useTheme from './hooks/useTheme';

const App: React.FC = () => {
    const [shifts, setShifts] = useState<Shift[]>([]);
    const [isFormVisible, setIsFormVisible] = useState(false);
    const [detailView, setDetailView] = useState<{ period: Period, date: Date } | null>(null);
    const [editingShift, setEditingShift] = useState<Shift | null>(null);
    const [isSettingsVisible, setIsSettingsVisible] = useState(false);
    const { theme, setTheme } = useTheme();


    // Load shifts from localStorage on initial render
    useEffect(() => {
        try {
            const storedShifts = localStorage.getItem('taxiShifts');
            if (storedShifts) {
                const parsedShifts: Shift[] = JSON.parse(storedShifts);
                // Ensure dates are parsed correctly
                const shiftsWithDateObjects = parsedShifts.map(shift => ({
                    ...shift,
                    date: new Date(shift.date),
                    fines: shift.fines || [], // ensure fines array exists
                    selfEmployedTax: shift.selfEmployedTax || 0, // ensure selfEmployedTax exists
                }));
                setShifts(shiftsWithDateObjects);
            }
        } catch (error) {
            console.error("Failed to load or parse shifts from localStorage", error);
        }
    }, []);

    // Save shifts to localStorage whenever they change
    useEffect(() => {
        try {
            localStorage.setItem('taxiShifts', JSON.stringify(shifts));
        } catch (error) {
            console.error("Failed to save shifts to localStorage", error);
        }
    }, [shifts]);

    const handleSaveShift = useCallback((savedShift: Shift) => {
        setShifts(prevShifts => {
            const isEditing = prevShifts.some(s => s.id === savedShift.id);
            let updatedShifts;
            if (isEditing) {
                updatedShifts = prevShifts.map(s => (s.id === savedShift.id ? savedShift : s));
            } else {
                updatedShifts = [...prevShifts, savedShift];
            }
            return updatedShifts.sort((a, b) => b.date.getTime() - a.date.getTime());
        });
        setIsFormVisible(false);
        setEditingShift(null);
    }, []);

    const handleDeleteShift = useCallback((id: string) => {
        setShifts(prevShifts => prevShifts.filter(shift => shift.id !== id));
    }, []);
    
    const handleShowDetails = useCallback((period: Period, date: Date) => {
        setDetailView({ period, date });
    }, []);

    const handleClearDetails = useCallback(() => {
        setDetailView(null);
    }, []);

    const handleStartEdit = (shift: Shift) => {
        setEditingShift(shift);
        setIsFormVisible(true);
    };

    const handleAddNew = () => {
        setEditingShift(null);
        setIsFormVisible(true);
    };
    
    const handleCancelForm = () => {
        setIsFormVisible(false);
        setEditingShift(null);
    };

    const sortedShifts = useMemo(() => {
        return [...shifts].sort((a, b) => b.date.getTime() - a.date.getTime());
    }, [shifts]);

    const getShiftsForPeriod = useMemo(() => {
        if (!detailView) return [];

        const { period, date } = detailView;

        if (period === 'day') {
             return shifts.filter(s => isSameDay(new Date(s.date), date));
        }
        if (period === 'week') {
            const start = getStartOfWeek(date);
            const end = getEndOfWeek(date);
            return shifts.filter(s => {
                const shiftDate = new Date(s.date);
                return shiftDate >= start && shiftDate <= end;
            });
        }
        if (period === 'month') {
            const start = getStartOfMonth(date);
            const end = getEndOfMonth(date);
             return shifts.filter(s => {
                const shiftDate = new Date(s.date);
                return shiftDate >= start && shiftDate <= end;
            });
        }
        return [];
    }, [shifts, detailView]);


    return (
        <div className={theme}>
            <div className="min-h-screen bg-gray-50 text-slate-800 dark:bg-black dark:text-slate-300 font-sans transition-colors">
                <div className="container mx-auto max-w-2xl p-4 pb-24">
                    {detailView ? (
                        <PeriodDetail 
                            period={detailView.period}
                            date={detailView.date}
                            shifts={getShiftsForPeriod}
                            onBack={handleClearDetails} 
                        />
                    ) : (
                        <>
                            <header className="py-6 text-center relative">
                                <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">Таксометр</h1>
                                <p className="text-slate-500 dark:text-slate-400">Ваш личный учет смен</p>
                                <button onClick={() => setIsSettingsVisible(true)} className="absolute top-6 right-0 p-2 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition-colors">
                                    <SettingsIcon className="w-6 h-6" />
                                </button>
                            </header>
                            
                            <main>
                                {isFormVisible ? (
                                    <ShiftForm 
                                        initialData={editingShift} 
                                        onSave={handleSaveShift} 
                                        onCancel={handleCancelForm} 
                                    />
                                ) : (
                                    <>
                                        <Stats shifts={shifts} onPeriodSelect={handleShowDetails} />
                                        <ShiftList shifts={sortedShifts} onDelete={handleDeleteShift} onEdit={handleStartEdit} />
                                    </>
                                )}
                            </main>
                            
                            {!isFormVisible && (
                                <div className="fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-gray-50 dark:from-black to-transparent">
                                    <div className="max-w-2xl mx-auto">
                                        <button
                                            onClick={handleAddNew}
                                            className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-4 px-6 rounded-xl shadow-lg flex items-center justify-center text-lg transition-transform transform active:scale-95"
                                        >
                                            <PlusIcon className="w-6 h-6 mr-2" />
                                            Добавить запись
                                        </button>
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </div>
                 <SettingsModal 
                    isOpen={isSettingsVisible} 
                    onClose={() => setIsSettingsVisible(false)}
                    currentTheme={theme}
                    onThemeChange={setTheme}
                />
            </div>
        </div>
    );
};

export default App;