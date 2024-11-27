// app/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import Folder from '@/components/Folder';
import AddFolder from '@/components/AddFolder';
import Link from 'next/link';
import { FolderPlus, LineChart, CheckCircle } from 'lucide-react';
import { Folder as FolderType } from '@/lib/types';
import { useSession } from 'next-auth/react';

export default function UserPage() {
  const [showEdit, setShowEdit] = useState<boolean>(false);
  const { data: session } = useSession();
  const user = session?.user;
  const [folders, setFolders] = useState<FolderType[]>([]);
  const [showFolderInput, setShowFolderInput] = useState<boolean>(false);

  const isAdmin = user?.is_admin;

  function toggleFolderInput() {
    setShowFolderInput((prevVal) => !prevVal);
  }

  function showEditForm() {
    setShowEdit(!showEdit);
  }

  useEffect(() => {
    if (isAdmin) {
      fetch(`/api/folders`)
        .then((res) => res.json())
        .then((folders: FolderType[]) => {
          setFolders(folders);
        });
    }
  }, [isAdmin]);

  const deleteFolder = (deleted_folder_id: number) => {
    setFolders((folders) => folders.filter((folder) => folder.id !== deleted_folder_id));
  };

  const updateFolders = (updatedFolder: FolderType) => {
    setFolders((folders) =>
      folders.map((folder) => (folder.id === updatedFolder.id ? updatedFolder : folder))
    );
  };

  const addFolder = (newFolder: FolderType) => {
    setFolders([...folders, newFolder]);
  };

  const foldersList = folders.map((folder) => {
    return (
      <Folder
        onDeleteFolder={deleteFolder}
        key={folder.id}
        id={folder.id}
        name={folder.name}
        onUpdateFolders={(folder) => updateFolders(folder)}
      />
    );
  });

  return (
    <div className="flex min-h-screen flex-col items-center bg-gray-50">
      <div className="w-full max-w-6xl mt-12">
        {/* My Account Section - Always visible */}
        <h4 className="relative my-8 text-center text-lg font-semibold text-gray-700 before:absolute before:left-0 before:top-1/2 before:w-full before:border-t before:border-gray-300">
          <span className="relative bg-gray-50 px-6">My Account</span>
        </h4>

        <div className="flex justify-center">
          <div className="m-6 rounded-lg border border-gray-300 bg-white p-8 shadow-md text-center">
            {user && (
              <>
                <div className="text-xl font-semibold text-gray-800">{user.username}</div>
                <div className="text-sm text-gray-600">{user.email}</div>
              </>
            )}
          </div>
        </div>

        {/* Admin-only content */}
        {isAdmin && (
          <>
            <div className="flex justify-center gap-4">
              <Link
                href="https://analytics.google.com/analytics/web/?authuser=1#/p451159949/reports/intelligenthome"
                target="_blank"
                className="inline-flex items-center gap-2 rounded-md bg-teal-500 px-8 py-3 text-sm font-medium text-white shadow-sm transition hover:bg-teal-600"
              >
                <LineChart className="h-5 w-5" />
                Google Analytics
              </Link>
              <Link
                href="/polladmin"
                className="inline-flex items-center gap-2 rounded-md bg-teal-500 px-8 py-3 text-sm font-medium text-white shadow-sm transition hover:bg-teal-600"
              >
                <CheckCircle className="h-5 w-5" />
                Contest Admin Panel
              </Link>
            </div>

            {/* Folders Section */}
            <div className="w-full max-w-6xl mt-12">
              <h4 className="relative my-8 text-center text-lg font-semibold text-gray-700 before:absolute before:left-0 before:top-1/2 before:w-full before:border-t before:border-gray-300">
                <span className="relative bg-gray-50 px-6">Folders</span>
              </h4>

              <div className="flex flex-col items-center">
                <div className="mb-6">
                  {showFolderInput ? (
                    <AddFolder onToggleFolder={toggleFolderInput} onAddFolder={addFolder} />
                  ) : (
                    <button
                      className="inline-flex items-center gap-2 rounded-md bg-teal-500 px-6 py-3 text-sm font-medium text-white shadow-sm transition hover:bg-teal-600"
                      onClick={toggleFolderInput}
                    >
                      <FolderPlus className="h-5 w-5" />
                      Create New Folder
                    </button>
                  )}
                </div>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">{foldersList}</div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
