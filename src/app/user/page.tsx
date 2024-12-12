// app/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import Folder from '@/components/Folder';
import AddFolder from '@/components/AddFolder';
import { FolderPlus, LineChart, CheckCircle } from 'lucide-react';
import { Folder as FolderType } from '@/lib/types';
import { useSession } from 'next-auth/react';
import { PrimaryButton } from '@/components/buttons/PrimaryButton';
import { signOut } from 'next-auth/react';

export default function UserPage() {
  const { data: session } = useSession();
  const user = session?.user;
  const [folders, setFolders] = useState<FolderType[]>([]);
  const [showFolderInput, setShowFolderInput] = useState<boolean>(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const isAdmin = user?.is_admin;

  function toggleFolderInput() {
    setShowFolderInput((prevVal) => !prevVal);
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

  const handleDeleteAccount = async () => {
    try {
      const response = await fetch('/api/user', {
        method: 'DELETE',
      });

      if (response.ok) {
        await signOut({ redirect: true, callbackUrl: '/' });
      } else {
        throw new Error('Failed to delete account');
      }
    } catch (error) {
      console.error('Error deleting account:', error);
      // You might want to show an error message to the user here
    }
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
    <div className="flex min-h-screen flex-col items-center bg-[var(--background)]">
      <div className="w-full max-w-6xl mt-12 px-4">
        {/* My Account Section - Always visible */}
        <h4
          className="relative my-8 text-center text-lg font-semibold text-[var(--text-primary)] 
                       before:absolute before:left-0 before:top-1/2 before:w-full 
                       before:border-t before:border-[var(--border)]"
        >
          <span className="relative bg-[var(--background)] px-6">My Account</span>
        </h4>

        <div className="flex justify-center">
          <div className="m-6 rounded-lg border border-[var(--card-border)] bg-[var(--background-elevated)] p-8 shadow-md text-center">
            {user && (
              <>
                <div className="text-xl font-semibold text-[var(--text-primary)]">{user.username}</div>
                <div className="text-sm text-[var(--text-secondary)]">{user.email}</div>
                <div className="mt-6 pt-6 border-t border-[var(--border)]">
                  {showDeleteConfirm ? (
                    <div className="space-y-4">
                      <p className="text-sm text-[var(--text-danger)]">
                        Are you sure? This action cannot be undone.
                      </p>
                      <div className="flex justify-center gap-4">
                        <button
                          onClick={() => handleDeleteAccount()}
                          className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                        >
                          Yes, delete my account
                        </button>
                        <button
                          onClick={() => setShowDeleteConfirm(false)}
                          className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={() => setShowDeleteConfirm(true)}
                      className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium 
                      text-[var(--text-primary)] bg-[var(--background)] border-2 border-red-500 rounded-md 
                      hover:bg-red-500 hover:text-white hover:border-transparent
                      focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 
                      focus-visible:ring-offset-2 transition-colors"
                    >
                      Delete Account
                    </button>
                  )}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Admin-only content */}
        {isAdmin && (
          <>
            <div className="flex justify-center gap-4">
              <PrimaryButton
                href="https://analytics.google.com/analytics/web/?authuser=1#/p451159949/reports/intelligenthome"
                text="Google Analytics"
                icon={LineChart}
                className="relative rounded-md"
              />

              <PrimaryButton
                href="/polladmin"
                text="Contest Admin Panel"
                icon={CheckCircle}
                className="relative rounded-md"
              />
            </div>

            {/* Folders Section */}
            <div className="w-full max-w-6xl mt-12">
              <h4
                className="relative my-8 text-center text-lg font-semibold text-[var(--text-primary)]
                            before:absolute before:left-0 before:top-1/2 before:w-full 
                            before:border-t before:border-[var(--border)]"
              >
                <span className="relative bg-[var(--background)] px-6">Folders</span>
              </h4>

              <div className="flex flex-col items-center">
                <div className="mb-6">
                  {showFolderInput ? (
                    <AddFolder onToggleFolder={toggleFolderInput} onAddFolder={addFolder} />
                  ) : (
                    <PrimaryButton
                      text="Create New Folder"
                      icon={FolderPlus}
                      onClick={toggleFolderInput}
                      className="rounded-md"
                    />
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
