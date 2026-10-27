import React, { createContext, useContext, useEffect, useState } from 'react';
import { DownloadHistoryItem } from '../types';

interface HistoryContextType {
  history: DownloadHistoryItem[];
  addToHistory: (item: Omit<DownloadHistoryItem, 'id' | 'timestamp'>) => void;
  removeFromHistory: (id: string) => void;
  clearHistory: () => void;
}

const HistoryContext = createContext<HistoryContextType | undefined>(undefined);

export function HistoryProvider({ children }: { children: React.ReactNode }) {
  const [history, setHistory] = useState<DownloadHistoryItem[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('quick_downloader_history') || localStorage.getItem('downly_history');
        if (saved) return JSON.parse(saved);
      } catch {
        // fallback
      }
    }
    return [];
  });

  useEffect(() => {
    try {
      localStorage.setItem('quick_downloader_history', JSON.stringify(history));
    } catch {
      // storage full or disabled
    }
  }, [history]);

  const addToHistory = (item: Omit<DownloadHistoryItem, 'id' | 'timestamp'>) => {
    setHistory((prev) => {
      // Avoid duplicate urls in history
      const filtered = prev.filter((h) => h.url !== item.url);
      const newItem: DownloadHistoryItem = {
        ...item,
        id: Math.random().toString(36).substring(2, 9),
        timestamp: Date.now(),
      };
      return [newItem, ...filtered].slice(0, 20); // Keep last 20
    });
  };

  const removeFromHistory = (id: string) => {
    setHistory((prev) => prev.filter((h) => h.id !== id));
  };

  const clearHistory = () => {
    setHistory([]);
  };

  return (
    <HistoryContext.Provider
      value={{ history, addToHistory, removeFromHistory, clearHistory }}
    >
      {children}
    </HistoryContext.Provider>
  );
}

export function useHistory(): HistoryContextType {
  const context = useContext(HistoryContext);
  if (!context) {
    throw new Error('useHistory must be used within a HistoryProvider');
  }
  return context;
}
