import { Redo2, Undo2 } from 'lucide-react';
import { useEffect } from 'react';
import { useHistoryStore } from '../../store/historyStore';

export function HistoryControls() {
  const canRedo = useHistoryStore((state) => state.future.length > 0);
  const canUndo = useHistoryStore((state) => state.past.length > 0);
  const redo = useHistoryStore((state) => state.redo);
  const undo = useHistoryStore((state) => state.undo);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!event.ctrlKey && !event.metaKey) {
        return;
      }

      const key = event.key.toLowerCase();
      const wantsUndo = key === 'z' && !event.shiftKey;
      const wantsRedo = key === 'y' || (key === 'z' && event.shiftKey);

      if (wantsUndo && useHistoryStore.getState().past.length > 0) {
        event.preventDefault();
        undo();
      } else if (wantsRedo && useHistoryStore.getState().future.length > 0) {
        event.preventDefault();
        redo();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [redo, undo]);

  return (
    <div className="flex items-center rounded-lg border border-slate-200 bg-white p-1">
      <button
        aria-label="撤销构图调整"
        className="flex size-7 items-center justify-center rounded-md text-slate-500 hover:bg-slate-100 disabled:text-slate-300"
        disabled={!canUndo}
        onClick={undo}
        title="撤销 Ctrl+Z"
        type="button"
      >
        <Undo2 className="size-4" />
      </button>
      <button
        aria-label="重做构图调整"
        className="flex size-7 items-center justify-center rounded-md text-slate-500 hover:bg-slate-100 disabled:text-slate-300"
        disabled={!canRedo}
        onClick={redo}
        title="重做 Ctrl+Shift+Z"
        type="button"
      >
        <Redo2 className="size-4" />
      </button>
    </div>
  );
}
