
import React, { useMemo } from 'react';
import { Shift } from '../types';
import { ArrowLeftIcon } from './icons/ArrowLeftIcon';
import { calculateShiftNet } from '../utils/calculations';
import { Period } from './Stats';
import { getStartOfWeek, getEndOfMonth } from '../utils/dateUtils';
import { TrashIcon } from './icons/TrashIcon';
import { PencilIcon } from './icons/PencilIcon';

interface PeriodDetailProps {
    period: Period;
    date: Date;
    shifts: Shift[];
    onBack: () => void;
    onDeleteShift?: (id: string) => void;
    onEditShift?: (shift: Shift) => void;
}

const StatPill: React.FC<{ label: string; value: string }> = ({ label, value }) => (
    <div className="bg-gray-200 dark:bg-gray-800 p-3 rounded-lg text-center flex-1">
        <p className="text-xs text-slate-500 dark:text-slate-400">{label}</p>
        <p className="font-semibold text-slate-900 dark:text-slate-200">{value}</p>
    </div>
);


const PeriodDetail: React.FC<PeriodDetailProps> = ({ period, date, shifts, onBack, onDeleteShift, onEditShift }) => {
    
    const { title, header } = useMemo(() => {
        let title = '';
        let header = '';
        if (period === 'day') {
            title = 'Сводка за день';
            header = date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' });
        }
        if (period === 'week') {
            title = 'Сводка за неделю';
            const start = getStartOfWeek(date);
            const end = new Date(start);
            end.setDate(start.getDate() + 6);
            header = `${start.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' })} - ${end.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' })}`;
        }
        if (period === 'month') {
            title = 'Сводка за месяц';
            header = date.toLocaleDateString('ru-RU', { month: 'long', year: 'numeric' });
        }
        return { title, header };
    }, [period, date]);

    const summary = useMemo(() => {
        return shifts.reduce((acc, shift) => {
            acc.gross += shift.cardEarnings + shift.cashEarnings;
            acc.net += calculateShiftNet(shift);
            acc.km += shift.odometerEnd - shift.odometerStart;
            acc.rangeChange += shift.rangeStart - shift.rangeEnd;
            acc.fuelCost += shift.fuelCost;
            acc.commissions += shift.yandexCommission + shift.parkCommission;
            acc.fines += shift.fines?.reduce((sum, f) => sum + f.amount, 0) ?? 0;
            acc.tax += shift.selfEmployedTax || 0;
            if (shift.deductRent) {
                acc.rent += shift.rentCost;
            }
            return acc;
        }, { gross: 0, net: 0, km: 0, rangeChange:0, fuelCost: 0, commissions: 0, fines: 0, tax: 0, rent: 0 });
    }, [shifts]);

    const handleDelete = (id: string) => {
        if (window.confirm('Вы уверены, что хотите удалить эту смену?')) {
            onDeleteShift?.(id);
        }
    };

    return (
        <div>
            <header className="flex items-center mb-6 relative">
                <button onClick={onBack} className="p-2 -ml-2 mr-4 text-slate-500 hover:text-slate-800 dark:hover:text-white absolute left-0 z-10">
                    <ArrowLeftIcon className="w-6 h-6" />
                </button>
                <div className="text-center w-full">
                    <h1 className="text-xl font-bold text-slate-900 dark:text-white">{header}</h1>
                    <p className="text-2xl font-bold text-slate-800 dark:text-slate-300 mt-1">{summary.net.toFixed(2)} ₽</p>
                </div>
            </header>

            <div className="bg-white dark:bg-gray-900/50 p-4 rounded-xl mb-6 shadow-sm">
                <h2 className="text-lg font-bold text-slate-900 dark:text-slate-200 mb-3">{title}</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    <StatPill label="Грязными" value={`${summary.gross.toFixed(2)} ₽`} />
                    <StatPill label="Пробег" value={`${summary.km} км`} />
                     <StatPill label="Расход (запас хода)" value={`${summary.rangeChange} км`} />
                    <StatPill label="Топливо" value={`${summary.fuelCost.toFixed(2)} ₽`} />
                    <StatPill label="Комиссии" value={`${summary.commissions.toFixed(2)} ₽`} />
                    <StatPill label="Штрафы" value={`${summary.fines.toFixed(2)} ₽`} />
                    <StatPill label="Налог СМЗ" value={`${summary.tax.toFixed(2)} ₽`} />
                    <StatPill label="Аренда" value={`${summary.rent.toFixed(2)} ₽`} />
                </div>
            </div>

            <div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-slate-200 mb-3">Смены за период</h2>
                {shifts.length > 0 ? (
                    <ul className="space-y-3">
                        {shifts.map(shift => (
                           <li key={shift.id} className="bg-gray-100 dark:bg-gray-900/50 p-4 rounded-lg flex justify-between items-center group transition-all hover:bg-gray-200 dark:hover:bg-gray-800">
                                <div className="flex-grow">
                                    <p className="font-semibold text-slate-800 dark:text-slate-200">{new Date(shift.date).toLocaleDateString('ru-RU', {day: '2-digit', month: 'short'})}</p>
                                    <p className="text-sm text-slate-500 dark:text-slate-400">
                                        Пробег: {shift.odometerEnd - shift.odometerStart} км
                                    </p>
                                </div>
                                <div className="flex items-center space-x-3">
                                    <p className={`text-lg font-bold ${calculateShiftNet(shift) >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                                        {calculateShiftNet(shift).toFixed(2)} ₽
                                    </p>
                                    <div className="flex space-x-1">
                                        <button onClick={() => onEditShift?.(shift)} className="p-2 text-slate-400 hover:text-blue-500 transition-colors rounded-full bg-white dark:bg-gray-800">
                                            <PencilIcon className="w-4 h-4" />
                                        </button>
                                        <button onClick={() => handleDelete(shift.id)} className="p-2 text-slate-400 hover:text-red-500 transition-colors rounded-full bg-white dark:bg-gray-800">
                                            <TrashIcon className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                           </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-slate-500 text-center py-4 italic">Нет данных о сменах за этот период.</p>
                )}
            </div>
        </div>
    );
};

export default PeriodDetail;
