
import React, { useState } from 'react';
import { X, Globe, Folder, ChevronDown, Check } from 'lucide-react';

interface AddBookmarkModalProps {
    isOpen: boolean;
    onClose: () => void;
    // onSave: (data: { url: string; folderId: string }) => void;
}

const AddBookmarkModal: React.FC<AddBookmarkModalProps> = ({ isOpen, onClose }) => {
    const [url, setUrl] = useState('');
    const [selectedFolder, setSelectedFolder] = useState('Unsorted');

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-slate-900/20 dark:bg-black/40 backdrop-blur-sm animate-in fade-in duration-200"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-white/10 p-6 animate-in zoom-in-95 slide-in-from-bottom-4 duration-200">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-black text-slate-900 dark:text-white">Add Bookmark</h2>
                    <button
                        onClick={onClose}
                        className="p-2 -mr-2 text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                <div className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-500 dark:text-gray-400 uppercase tracking-wider ml-1">
                            URL
                        </label>
                        <div className="relative">
                            <Globe className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                            <input
                                type="url"
                                value={url}
                                onChange={(e) => setUrl(e.target.value)}
                                placeholder="https://"
                                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl py-3 pl-11 pr-4 text-slate-900 dark:text-white font-medium focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500 transition-all placeholder:text-slate-400"
                                autoFocus
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-500 dark:text-gray-400 uppercase tracking-wider ml-1">
                            Folder
                        </label>
                        <div className="relative">
                            <button className="w-full flex items-center justify-between bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl py-3 px-4 text-left font-medium text-slate-900 dark:text-white hover:bg-slate-100 dark:hover:bg-slate-700/80 transition-colors group">
                                <div className="flex items-center gap-3">
                                    <div className="p-1.5 bg-teal-100 dark:bg-teal-900/30 rounded-lg text-teal-600 dark:text-teal-400">
                                        <Folder size={16} />
                                    </div>
                                    {selectedFolder}
                                </div>
                                <ChevronDown size={16} className="text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300" />
                            </button>
                        </div>
                    </div>
                </div>

                <div className="flex gap-3 mt-8">
                    <button
                        onClick={onClose}
                        className="flex-1 py-3.5 rounded-2xl font-bold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onClose} // Needs implementation
                        className="flex-1 py-3.5 rounded-2xl font-bold text-white bg-teal-500 hover:bg-teal-600 shadow-lg shadow-teal-500/20 active:scale-95 transition-all flex items-center justify-center gap-2"
                    >
                        <Check size={18} strokeWidth={3} />
                        Save
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AddBookmarkModal;
