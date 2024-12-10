// Folder.tsx
import { useState } from 'react';
import { Edit, X } from 'lucide-react';
import EditFolder from './EditFolder';
import { Folder as FolderType } from '@/lib/types';
import { PrimaryButton } from './buttons/PrimaryButton';

interface FolderProps {
  id: number;
  name: string;
  onDeleteFolder: (id: number) => void;
  onUpdateFolders: (folder: FolderType) => void;
}

export default function Folder({ id, name, onDeleteFolder, onUpdateFolders }: FolderProps) {
  const [showEdit, setShowEdit] = useState<boolean>(false);
  const [folderName, setFolderName] = useState<string>(name);

  const handleDeleteFolder = async () => {
    if (window.confirm('Are you sure you want to delete this folder?')) {
      await fetch(`/api/folders/${id}`, {
        method: 'DELETE',
      }).then(() => {
        onDeleteFolder(id);
      });
    }
  };

  function toggleEdit(): void {
    setShowEdit(prevVal => !prevVal);
  }

  return (
    <div className="rounded-lg border border-[var(--card-border)] shadow-sm">
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
      <div className="border-t border-[var(--card-border) p-4 space-x-2">
        <PrimaryButton text="Edit" icon={Edit} onClick={toggleEdit} className="rounded-md" />
        <PrimaryButton text="Delete" icon={X} onClick={handleDeleteFolder} className="rounded-md" />
      </div>
    </div>
  );
}
