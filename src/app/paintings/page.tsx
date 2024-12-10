'use client';
import React, { useState, Suspense } from 'react';
import { Plus } from 'lucide-react';
import PaintingsList from '@/components/PaintingsList';
import PaintingSkeleton from '@/components/PaintingSkeleton';
import Search from '@/components/Search';
import { useSession } from 'next-auth/react';
import { usePaintings } from '@/hooks/usePaintings';
import { useFolders } from '@/hooks/useFolders';
import type { Painting } from '@/lib/types';
import { PrimaryButton } from '@/components/buttons/PrimaryButton';
import LoadingSpinner from '@/components/LoadingSpinner';

const ITEMS_PER_PAGE = 6;

export default function PaintingsPage() {
  const { data: session } = useSession();
  const isAdmin = session?.user?.is_admin ?? false;
  const { data: paintings, isLoading: paintingsLoading, error: paintingsError } = usePaintings();
  const { data: folders, isLoading: foldersLoading } = useFolders();

  const [selectedFolder, setSelectedFolder] = useState('none');
  const [searchQ, setSearchQ] = useState('');
  const [sortBy, setSortBy] = useState('Default');
  const [forSale, setForSale] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  if (paintingsLoading || foldersLoading) {
    return <LoadingSpinner />;
  }

  // Error state
  if (paintingsError) {
    return (
      <div className="flex justify-center items-center min-h-screen text-red-500">
        {paintingsError.message}
      </div>
    );
  }

  const results = (paintings ?? []).filter((painting: Painting) => {
    return painting.title.toLowerCase().includes(searchQ.toLowerCase());
  });

  const searchResults = results.filter((painting: Painting) => {
    if (forSale === true) {
      return painting.sold !== true;
    } else {
      return painting;
    }
  });

  if (sortBy === 'Small') {
    searchResults.sort((a: Painting, b: Painting) =>
      (a.width ?? 0) * (a.height ?? 0) < (b.width ?? 0) * (b.height ?? 0) ? -1 : 1
    );
  } else if (sortBy === 'Large') {
    searchResults.sort((a: Painting, b: Painting) =>
      (a.width ?? 0) * (a.height ?? 0) > (b.width ?? 0) * (b.height ?? 0) ? -1 : 1
    );
  } else if (sortBy === 'Low') {
    searchResults.sort((a: Painting, b: Painting) =>
      (a.sale_price ?? 0) < (b.sale_price ?? 0) ? -1 : 1
    );
  } else if (sortBy === 'High') {
    searchResults.sort((a: Painting, b: Painting) =>
      (a.sale_price ?? 0) > (b.sale_price ?? 0) ? -1 : 1
    );
  }

  const folderResults = searchResults.filter((painting: Painting) => {
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
          folders={folders ?? []}
          selectedFolder={selectedFolder}
          setSelectedFolder={handleSelectedFolder}
        />
        {session?.user && isAdmin && (
          <div className="grid place-items-center pt-5">
            <PrimaryButton
              href="/paintings/new"
              icon={Plus}
              hoverText="Add Painting"
              className="w-60 rounded-full"
              showTextOnHover
            >
              <span className="block group-hover:hidden">
                <Plus className="h-6 w-6" />
              </span>
              <span className="hidden group-hover:block">Add Painting</span>
            </PrimaryButton>
          </div>
        )}
      </div>
      <Suspense fallback={<PaintingSkeleton />}>
        <div className="container mx-auto pt-6">
          <PaintingsList paintings={paginatedResults} />

          {/* Pagination Controls */}
          <div className="flex justify-center gap-2 mt-8">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="inline-flex items-center justify-center bg-gradient-to-t from-violet-600 via-blue-500 to-teal-400 
                         px-4 py-2 text-white rounded
                         hover:from-violet-700 hover:via-blue-600 hover:to-teal-500 
                         disabled:opacity-50 disabled:cursor-not-allowed
                         transition-all shadow-sm"
            >
              Previous
            </button>
            <span className="px-4 py-2">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="inline-flex items-center justify-center bg-gradient-to-t from-violet-600 via-blue-500 to-teal-400 
                         px-4 py-2 text-white rounded
                         hover:from-violet-700 hover:via-blue-600 hover:to-teal-500 
                         disabled:opacity-50 disabled:cursor-not-allowed
                         transition-all shadow-sm"
            >
              Next
            </button>
          </div>
        </div>
      </Suspense>
    </div>
  );
}
