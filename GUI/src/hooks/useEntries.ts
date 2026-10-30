import { useState } from 'react';
import { Entry } from '../types/entry';

const now = Date.now();

const SAMPLE_ENTRIES: Entry[] = [
  {
    id: 1,
    key: 'email',
    value: 'hina@example.com',
    isPinned: true,
    useCount: 5,
    createdAt: now,
    updatedAt: now,
  },
  {
    id: 2,
    key: 'phone',
    value: '+91 98765 43210',
    isPinned: false,
    useCount: 12,
    createdAt: now,
    updatedAt: now,
  },
  {
    id: 3,
    key: 'address',
    value: '12 MG Road\nAhmedabad',
    isPinned: false,
    useCount: 2,
    createdAt: now,
    updatedAt: now,
  },
  {
    id: 4,
    key: 'github',
    value: 'github.com/HinaJadav',
    isPinned: true,
    useCount: 8,
    createdAt: now,
    updatedAt: now,
  },
];

export default function useEntries() {
  const [entries, setEntries] = useState<Entry[]>(SAMPLE_ENTRIES);

  const deleteEntry = (id: number) => {
    setEntries((prev) => prev.filter((entry) => entry.id !== id));
  };

  const addEntry = (key: string, value: string): string | null => {
    const trimmedKey = key.trim();

    if (trimmedKey === '' || value.trim() === '') {
      return 'Key and value are required.';
    }

    const exists = entries.some(
      (entry) => entry.key.toLowerCase() === trimmedKey.toLowerCase(), // case-insensitive
    );

    if (exists) {
      return `"${trimmedKey}" already exists.`;
    }

    const timestamp = Date.now();
    const newEntry: Entry = {
      id: Math.max(0, ...entries.map((entry) => entry.id)) + 1,
      key: trimmedKey,
      value,
      isPinned: false,
      useCount: 0,
      createdAt: timestamp,
      updatedAt: timestamp,
    };

    setEntries((prev) => [newEntry, ...prev]);
    return null;
  };

  return {
    entries,
    deleteEntry,
    addEntry,
  };
}
