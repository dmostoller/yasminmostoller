'use client';
import React, { useState, Suspense, useCallback } from 'react';
import { Plus } from 'lucide-react';
import PaintingsList from '@/components/PaintingsList';
import PaintingSkeleton from '@/components/PaintingSkeleton';
import Search from '@/components/Search';
import { useSession } from 'next-auth/react';
import { usePaintings } from '@/hooks/usePaintings';
import { useFolders } from '@/hooks/useFolders';
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll';
import type { Painting } from '@/lib/types';
import { PrimaryButton } from '@/components/buttons/PrimaryButton';
import LoadingSpinner from '@/components/LoadingSpinner';

// const ITEMS_PER_PAGE = 6;
const ITEMS_PER_BATCH = 6;

export default function PaintingsPage() {
  const { data: session } = useSession();
  const isAdmin = session?.user?.is_admin ?? false;
  const { data: paintings, isLoading: paintingsLoading, error: paintingsError } = usePaintings();
  const { data: folders, isLoading: foldersLoading } = useFolders();
  const [selectedFolder, setSelectedFolder] = useState('');
  const [searchQ, setSearchQ] = useState('');
  const [sortBy, setSortBy] = useState('Newest');
  const [forSale, setForSale] = useState(false);
  const [displayedItems, setDisplayedItems] = useState(ITEMS_PER_BATCH);

  const loadMore = useCallback(() => {
    setDisplayedItems(prev => prev + ITEMS_PER_BATCH);
    setIsFetching(false);
  }, []);

  const { isFetching, setIsFetching, lastElementRef } = useInfiniteScroll(loadMore);

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

  if (sortBy === 'Newest') {
    searchResults.sort((a: Painting, b: Painting) => (Number(a.id) > Number(b.id) ? -1 : 1));
  } else if (sortBy === 'Oldest') {
    searchResults.sort((a: Painting, b: Painting) => (Number(a.id) < Number(b.id) ? -1 : 1));
  } else if (sortBy === 'Small') {
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
    if (!selectedFolder) {
      return true;
    }
    return painting.folder_id === Number(selectedFolder);
  });

  const handleSortBy = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortBy(e.target.value);
  };

  const handleSelectedFolder = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedFolder(e.target.value);
  };

  const paginatedResults = folderResults.slice(0, displayedItems);
  const hasMore = displayedItems < folderResults.length;

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
        <PaintingsList paintings={paginatedResults} lastElementRef={lastElementRef} />
        {isFetching && hasMore && (
          <Suspense fallback={<PaintingSkeleton />}>
            <PaintingsList
              paintings={paginatedResults.slice(displayedItems - ITEMS_PER_BATCH)}
              lastElementRef={lastElementRef}
            />
          </Suspense>
        )}
      </Suspense>
    </div>
  );
}
