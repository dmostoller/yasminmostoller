// Folder.tsx
import { useState } from 'react';
import { Edit, X } from 'lucide-react';
import EditFolder from './EditFolder';
import { Folder as FolderType } from '@/lib/types';

interface FolderProps {
  id: number;
  name: string;
  onDeleteFolder: (id: number) => void;
  onUpdateFolders: (folder: FolderType) => void;
}

export default function Folder({ id, name, onDeleteFolder, onUpdateFolders }: FolderProps) {
  const [showEdit, setShowEdit] = useState<boolean>(false);
  const [folderName, setFolderName] = useState<string>(name);

  const handleDeleteFolder = async (e: React.MouseEvent<HTMLButtonElement>) => {
    if (window.confirm('Are you sure you want to delete this folder?')) {
      await fetch(`/api/folders/${id}`, {
        method: 'DELETE'
      }).then(() => {
        onDeleteFolder(id);
      });
    }
  };

  function toggleEdit(): void {
    setShowEdit((prevVal) => !prevVal);
  }

  return (
    <div className="rounded-lg border border-gray-300 shadow-sm">
      <div className="p-4">
        <div className="text-lg font-semibold text-center">
          {showEdit ? (
            <EditFolder
              name={folderName}
              id={id}
              onToggleEdit={toggleEdit}
              setFolderName={setFolderName}
              onUpdateFolders={onUpdateFolders}
            />
          ) : (
            folderName
          )}
        </div>
      </div>
      <div className="border-t border-gray-200 p-4">
        <button
          className="mr-2 inline-flex items-center rounded-md border border-teal-500 px-4 py-2 text-sm font-medium text-teal-500 hover:bg-teal-50 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
          onClick={toggleEdit}
        >
          <Edit className="mr-2 h-4 w-4" />
          Edit
        </button>
        <button
          className="inline-flex items-center rounded-md border border-teal-500 px-4 py-2 text-sm font-medium text-teal-500 hover:bg-teal-50 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
          onClick={handleDeleteFolder}
        >
          <X className="mr-2 h-4 w-4" />
          Delete
        </button>
      </div>
    </div>
  );
}
