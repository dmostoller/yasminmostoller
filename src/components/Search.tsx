// Search.tsx
'use client';

import { Search as SearchIcon } from 'lucide-react';
import { ChangeEvent } from 'react';
import { Select } from './Select';
import { Input } from './Input';

interface Folder {
  id: number;
  name: string;
}

interface SearchProps {
  searchQ: string;
  onSearch: (value: string) => void;
  sortBy: (e: ChangeEvent<HTMLSelectElement>) => void;
  selected: string;
  forSale: boolean;
  setForSale: (value: boolean) => void;
  selectedFolder: string;
  setSelectedFolder: (e: ChangeEvent<HTMLSelectElement>) => void;
  folders: Folder[];
}

export default function Search({
  searchQ,
  onSearch,
  sortBy,
  selected,
  forSale,
  setForSale,
  selectedFolder,
  setSelectedFolder,
  folders,
}: SearchProps) {
  function toggleForSale() {
    setForSale(!forSale);
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-center max-w-6xl mx-auto">
      <div className="relative">
        <Input
          type="text"
          value={searchQ}
          placeholder="Search..."
          onChange={e => onSearch(e.target.value)}
          icon={<SearchIcon className="h-4 w-4" />}
        />
        <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--text-secondary)]" />
      </div>

      <Select
        name="folder"
        value={selectedFolder}
        onChange={setSelectedFolder}
        placeholder="Select a Folder"
        options={folders.map(folder => ({
          value: folder.id,
          label: folder.name,
        }))}
      />

      <Select
        name="sort"
        value={selected}
        onChange={sortBy}
        options={[
          { value: 'Newest', label: 'Date: Newest First' },
          { value: 'Oldest', label: 'Date: Oldest First' },
          { value: 'Small', label: 'Size: Small - Large' },
          { value: 'Large', label: 'Size: Large - Small' },
          { value: 'Low', label: 'Price: Low - High' },
          { value: 'High', label: 'Price: High - Low' },
        ]}
      />

      <div className="justify-self-center sm:justify-self-start">
        <label className="flex items-center gap-2">
          <div className="relative inline-flex items-center">
            <input
              type="checkbox"
              className="peer sr-only"
              checked={forSale}
              onChange={toggleForSale}
            />
            <div className="h-6 w-11 rounded-full bg-[var(--background-secondary)] after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-[var(--text-secondary)] after:bg-[var(--background-secondary)] after:transition-all after:content-[''] peer-checked:bg-blue-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300"></div>
          </div>
          <span className="text-sm font-medium text-[var(--text-primary)]">For Sale</span>
        </label>
      </div>
    </div>
  );
}
