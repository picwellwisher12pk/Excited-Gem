import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Trash2, FolderInput, XCircle, Pin } from 'lucide-react'; // Using icons
import { clearSelectedTabs, toggleSelectionMode } from '~/store/tabSlice';
import type { RootState } from '~/store/store';

export function FloatingActionBar() {
    const dispatch = useDispatch();
    const selectedTabs = useSelector((state: RootState) => state.tabs.selectedTabs);
    const isSelectionMode = useSelector((state: RootState) => state.tabs.isSelectionMode);

    // Only show if in selection mode AND tabs are selected
    if (!isSelectionMode || selectedTabs.length === 0) return null;

    const handleClose = () => {
        dispatch(clearSelectedTabs());
        dispatch(toggleSelectionMode(false));
    };

    const handleBulkDelete = () => {
        if (confirm(`Close ${selectedTabs.length} tabs?`)) {
            chrome.tabs.remove(selectedTabs);
            handleClose();
        }
    };

    // Placeholder handlers
    const handleBulkGroup = () => {
        console.log('Group tabs:', selectedTabs);
    };

    const handleBulkPin = () => {
        // Toggle pin state for all? Or pin all? Implementation depends on requirement.
        console.log('Pin tabs:', selectedTabs);
    };

    return (
        <div className="fixed bottom-4 left-4 right-4 bg-slate-800 text-white rounded-xl shadow-xl flex items-center justify-between px-4 py-3 z-50 animate-in slide-in-from-bottom duration-300">
            <div className="flex items-center gap-4">
                <span className="font-semibold">{selectedTabs.length} Selected</span>
            </div>

            <div className="flex items-center gap-2">
                <button
                    onClick={handleBulkPin}
                    className="p-2 hover:bg-slate-700 rounded-full transition-colors"
                    title="Pin Selected"
                >
                    <Pin size={20} />
                </button>
                <button
                    onClick={handleBulkGroup}
                    className="p-2 hover:bg-slate-700 rounded-full transition-colors"
                    title="Group Selected"
                >
                    <FolderInput size={20} />
                </button>
                <button
                    onClick={handleBulkDelete}
                    className="p-2 hover:bg-red-900/50 text-red-400 rounded-full transition-colors"
                    title="Close Selected"
                >
                    <Trash2 size={20} />
                </button>
                <div className="w-px h-6 bg-slate-600 mx-1"></div>
                <button
                    onClick={handleClose}
                    className="p-2 hover:bg-slate-700 rounded-full transition-colors"
                    title="Cancel Selection"
                >
                    <XCircle size={20} />
                </button>
            </div>
        </div>
    );
}
