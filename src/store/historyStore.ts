import { create } from 'zustand';

const MAX_HISTORY_ENTRIES = 30;

interface HistoryEntry {
  label: string;
  redo: () => void;
  undo: () => void;
}

interface HistoryStore {
  future: HistoryEntry[];
  past: HistoryEntry[];
  clear: () => void;
  record: (entry: HistoryEntry) => void;
  redo: () => void;
  undo: () => void;
}

export const useHistoryStore = create<HistoryStore>((set, get) => ({
  future: [],
  past: [],
  clear: () => set({ future: [], past: [] }),
  record: (entry) =>
    set((state) => ({
      future: [],
      past: [...state.past, entry].slice(-MAX_HISTORY_ENTRIES),
    })),
  redo: () => {
    const entry = get().future.at(-1);

    if (!entry) {
      return;
    }

    entry.redo();
    set((state) => ({
      future: state.future.slice(0, -1),
      past: [...state.past, entry],
    }));
  },
  undo: () => {
    const entry = get().past.at(-1);

    if (!entry) {
      return;
    }

    entry.undo();
    set((state) => ({
      future: [...state.future, entry],
      past: state.past.slice(0, -1),
    }));
  },
}));
