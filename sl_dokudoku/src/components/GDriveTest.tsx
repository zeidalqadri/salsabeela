'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';

export default function GDriveTest() {
  const { data: session } = useSession();
  const [files, setFiles] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const testGDrive = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/api/gdrive/test');
      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || 'Failed to fetch files');
      }
      
      setFiles(data.files || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const importFiles = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/api/gdrive/import', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          folderId: '10zMdsrvVst0MBJUIY8R59S4MlJJ0fla2',
        }),
      });
      
      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || 'Failed to import files');
      }
      
      alert(`Successfully imported ${data.importedCount} files!`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  if (!session) {
    return <div>Please sign in to test Google Drive integration.</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-4">
        <button
          onClick={testGDrive}
          disabled={loading}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
        >
          {loading ? 'Loading...' : 'Test Google Drive'}
        </button>
        
        <button
          onClick={importFiles}
          disabled={loading}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50"
        >
          {loading ? 'Importing...' : 'Import Files'}
        </button>
      </div>

      {error && (
        <div className="p-4 bg-red-100 text-red-700 rounded">
          Error: {error}
        </div>
      )}

      {files.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold mb-2">Files in Google Drive:</h2>
          <ul className="space-y-2">
            {files.map((file: any) => (
              <li key={file.id} className="p-2 bg-gray-100 rounded">
                <div className="font-medium">{file.name}</div>
                <div className="text-sm text-gray-600">
                  Type: {file.mimeType}
                  {file.size && ` • Size: ${Math.round(file.size / 1024)} KB`}
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
} 