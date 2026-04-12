import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, X } from 'lucide-react';

interface AddCalendarModalProps {
    onClose: () => void;
    onSave: (data: { name: string; color: string }) => void;
}

const AddCalendarModal: React.FC<AddCalendarModalProps> = ({ onClose, onSave }) => {
    const [name, setName] = useState('');
    const [color, setColor] = useState('#10b981');
    const colors = ['#10b981', '#3b82f6', '#8b5cf6', '#f59e0b', '#ef4444', '#ec4899', '#64748b', '#06b6d4'];

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="relative w-full max-w-sm bg-white dark:bg-slate-900 rounded-3xl shadow-2xl p-6"
            >
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-black">새 캘린더 만들기</h2>
                    <button onClick={onClose} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors">
                        <X size={20} />
                    </button>
                </div>
                <div className="space-y-5">
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">이름</label>
                        <input
                            type="text"
                            autoFocus
                            value={name}
                            onChange={(event) => setName(event.target.value)}
                            placeholder="예: 프로젝트"
                            className="w-full bg-slate-100 dark:bg-slate-800 rounded-xl px-4 py-3 outline-none text-sm"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">색상</label>
                        <div className="grid grid-cols-4 gap-3">
                            {colors.map((item) => (
                                <button
                                    key={item}
                                    onClick={() => setColor(item)}
                                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${color === item ? 'ring-4 ring-offset-2 ring-offset-white dark:ring-offset-slate-900 scale-110' : 'hover:scale-105'}`}
                                    style={{ backgroundColor: item, ringColor: item }}
                                >
                                    {color === item && <Check size={18} className="text-white" />}
                                </button>
                            ))}
                        </div>
                    </div>
                    <button
                        onClick={() => onSave({ name, color })}
                        disabled={!name}
                        className="w-full py-3.5 bg-teal-500 text-white rounded-2xl font-black shadow-lg shadow-teal-500/20 disabled:opacity-30 mt-2"
                    >
                        캘린더 생성
                    </button>
                </div>
            </motion.div>
        </div>
    );
};

export default AddCalendarModal;
