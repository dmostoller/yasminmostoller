// Search.tsx
'use client';

import { Search as SearchIcon } from 'lucide-react';
import { ChangeEvent } from 'react';

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

  const folderList = folders.map(folder => (
    <option key={folder.id} value={folder.id} className="px-4 py-2">
      {folder.name}
    </option>
  ));

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-center max-w-6xl mx-auto">
      <div className="relative">
        <input
          type="text"
          value={searchQ}
          placeholder="Search..."
          onChange={e => onSearch(e.target.value)}
          className="w-full rounded-lg border border-[var(--text-secondary)] pl-10 pr-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 bg-[var(--background-secondary)] text-[var(--text-primary)]"
        />
        <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--text-secondary)]" />
      </div>

      <select
        className="w-full rounded-lg border border-[var(--text-secondary)] px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 bg-[var(--background-secondary)] text-[var(--text-primary)]"
        name="folder"
        value={selectedFolder}
        onChange={setSelectedFolder}
      >
        <option value="none">Select Folder: </option>
        {folderList}
      </select>

      <select
        className="w-full rounded-lg border border-[var(--text-secondary)] px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 bg-[var(--background-secondary)] text-[var(--text-primary)]"
        name="sort"
        value={selected}
        onChange={sortBy}
      >
        <option value="Default">Sort by: </option>
        <option value="Small">Size: Small - Large</option>
        <option value="Large">Size: Large - Small</option>
        <option value="Low">Price: Low - High</option>
        <option value="High">Price: High - Low</option>
      </select>

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
