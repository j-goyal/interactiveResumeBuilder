import { useEffect } from 'react'

export const useKeyboardShortcuts = (
  onSave: () => void,
  onUndo: () => void
) => {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.ctrlKey || event.metaKey) {
        switch (event.key.toLowerCase()) {
          case 's':
            event.preventDefault()
            onSave()
            break
          case 'z':
            event.preventDefault()
            onUndo()
            break
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onSave, onUndo])
}

