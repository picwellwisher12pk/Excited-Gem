
import { useDispatch, useSelector } from 'react-redux'
import { Trash2, FolderInput, XCircle, Pin, BookmarkPlus } from 'lucide-react'
import { clearSelectedTabs, toggleSelectionMode } from '~/store/tabSlice'
import type { RootState } from '~/store/store'
import { useState } from 'react'
import { SaveListModal } from './Modals/SaveListModal'
import { message } from 'antd'

export function FloatingActionBar() {
  const dispatch = useDispatch()
  const selectedTabs = useSelector(
    (state: RootState) => state.tabs.selectedTabs
  )
  const isSelectionMode = useSelector(
    (state: RootState) => state.tabs.isSelectionMode
  )
  const [saveListOpen, setSaveListOpen] = useState(false)

  // Show whenever any tabs are selected (regardless of selection mode flag)
  if (selectedTabs.length === 0) return null

  const handleClose = () => {
    dispatch(clearSelectedTabs())
    if (isSelectionMode) dispatch(toggleSelectionMode(false))
  }

  const handleBulkDelete = () => {
    if (confirm(`Close ${selectedTabs.length} tabs?`)) {
      chrome.tabs.remove(selectedTabs)
      handleClose()
    }
  }

  const handleBulkGroup = () => {
    console.log('Group tabs:', selectedTabs)
  }

  const handleBulkPin = () => {
    console.log('Pin tabs:', selectedTabs)
  }

  const handleSaved = () => {
    message.success('List saved!')
    dispatch(clearSelectedTabs())
    if (isSelectionMode) dispatch(toggleSelectionMode(false))
  }

  return (
    <>
      <div className="fixed bottom-4 left-4 right-4 bg-slate-800 text-white rounded-xl shadow-xl flex items-center justify-between px-4 py-3 z-50 animate-in slide-in-from-bottom duration-300">
        <div className="flex items-center gap-4">
          <span className="font-semibold">{selectedTabs.length} Selected</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setSaveListOpen(true)}
            className="p-2 hover:bg-blue-600 rounded-full transition-colors"
            title="Save as List"
          >
            <BookmarkPlus size={20} />
          </button>
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

      <SaveListModal
        open={saveListOpen}
        selectedTabIds={selectedTabs}
        onClose={() => setSaveListOpen(false)}
        onSaved={handleSaved}
      />
    </>
  )
}
