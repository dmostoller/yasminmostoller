// page.tsx
'use client';
import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { Plus, Folder } from 'lucide-react';
import PaintingsList from '@/components/PaintingsList';
import PaintingSkeleton from '@/components/PaintingSkeleton';
import Search from '@/components/Search';
import { useSession } from 'next-auth/react';
// import AddFolder from './AddFolder';
import type { Painting, Folder as FolderType } from '@/lib/types';

const ITEMS_PER_PAGE = 6;

export default function PaintingsPage() {
  const { data: session } = useSession();
  const isAdmin = false;
  const [paintings, setPaintings] = useState<Painting[]>([]);
  const [folders, setFolders] = useState<FolderType[]>([]);
  const [selectedFolder, setSelectedFolder] = useState('none');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQ, setSearchQ] = useState('');
  const [sortBy, setSortBy] = useState('Default');
  const [forSale, setForSale] = useState(false);
  const [showFolderInput, setShowFolderInput] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        // Fetch paintings
        const paintingsRes = await fetch('/api/paintings');
        if (!paintingsRes.ok) {
          throw new Error('Failed to fetch paintings');
        }
        const paintingsData = await paintingsRes.json();
        setPaintings(paintingsData);

        // Fetch folders
        const foldersRes = await fetch('/api/folders');
        const foldersData = await foldersRes.json();
        setFolders(foldersData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        console.error('Error fetching data:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    // Reset to page 1 whenever filters change
    setCurrentPage(1);
  }, [searchQ, sortBy, forSale, selectedFolder]);

  // Helper functions
  function toggleFolderInput() {
    setShowFolderInput((prevVal) => !prevVal);
  }

  if (isLoading) {
    return (
      <div className="container mx-auto min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500"></div>
      </div>
    );
  }

  if (error) {
    return <div className="flex justify-center items-center min-h-screen text-red-500">{error}</div>;
  }

  const results = paintings.filter((painting) => {
    return painting.title.toLowerCase().includes(searchQ.toLowerCase());
  });

  const searchResults = results.filter((painting) => {
    if (forSale === true) {
      return painting.sold !== true;
    } else {
      return painting;
    }
  });

  if (sortBy === 'Small') {
    searchResults.sort((a, b) => (a.width * a.height < b.width * b.height ? -1 : 1));
  } else if (sortBy === 'Large') {
    searchResults.sort((a, b) => (a.width * a.height > b.width * b.height ? -1 : 1));
  } else if (sortBy === 'Low') {
    searchResults.sort((a, b) => (a.sale_price < b.sale_price ? -1 : 1));
  } else if (sortBy === 'High') {
    searchResults.sort((a, b) => (a.sale_price > b.sale_price ? -1 : 1));
  }

  const folderResults = searchResults.filter((painting) => {
    if (selectedFolder !== 'none') {
      if (painting.folder_id === parseInt(selectedFolder, 10)) {
        console.log(painting.folder_id);
        return true;
      }
      return false;
    } else {
      return true;
    }
  });

  // Pagination logic
  const totalPages = Math.ceil(folderResults.length / ITEMS_PER_PAGE);
  const paginatedResults = folderResults.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const addFolder = (newFolder: FolderType) => {
    setFolders([...folders, newFolder]);
  };

  const handleSortBy = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortBy(e.target.value);
  };

  const handleSelectedFolder = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedFolder(e.target.value);
  };

  return (
    <div className="container mx-auto min-h-screen px-4 mb-8">
      <div className="container mx-auto mt-12">
        <Search
          searchQ={searchQ}
          onSearch={setSearchQ}
          selected={sortBy}
          sortBy={handleSortBy}
          forSale={forSale}
          setForSale={setForSale}
          folders={folders}
          selectedFolder={selectedFolder}
          setSelectedFolder={handleSelectedFolder}
        />
        {session?.user && isAdmin && (
          <div className="grid place-items-center pt-5">
            <Link
              href="/paintings/new"
              className="inline-flex items-center rounded-full bg-teal-600 px-4 py-2 text-white hover:bg-teal-700"
            >
              <Plus className="mr-2 h-5 w-5" />
              Add Painting
            </Link>

            {showFolderInput ? (
              <></>
            ) : (
              //   <AddFolder onToggleFolder={toggleFolderInput} onAddFolder={addFolder} />
              <button
                className="ml-4 inline-flex items-center rounded-full bg-teal-600 px-4 py-2 text-white hover:bg-teal-700"
                onClick={toggleFolderInput}
              >
                <Folder className="mr-2 h-5 w-5" />
                Create Folder
              </button>
            )}
          </div>
        )}
      </div>
      <Suspense fallback={<PaintingSkeleton />}>
        <div className="container mx-auto pt-12">
          <PaintingsList paintings={paginatedResults} />

          {/* Pagination Controls */}
          <div className="flex justify-center gap-2 mt-8">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 rounded bg-teal-600 text-white disabled:bg-gray-300"
            >
              Previous
            </button>
            <span className="px-4 py-2">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-4 py-2 rounded bg-teal-600 text-white disabled:bg-gray-300"
            >
              Next
            </button>
          </div>
        </div>
      </Suspense>
    </div>
  );
}
