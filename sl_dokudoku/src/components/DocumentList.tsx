'use client'

import React, { useState } from 'react'; // Import React
import type { DocumentWithUser } from '@/lib/types'; // Import shared type
import { useSession } from 'next-auth/react';
import { LoadingOverlay } from './LoadingState'; // Assuming this exists
import { formatDate } from '@/lib/utils'; // Assuming this exists

interface DocumentListProps {
  documents: DocumentWithUser[];
  // Change onDelete to accept a synchronous function, matching the mutation hook's mutate function
  onDelete?: (id: string) => void; 
}

export function DocumentList({ documents, onDelete }: DocumentListProps) {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<string | null>(null);

  const handleDelete = (id: string) => { // Make synchronous
    if (!onDelete) return;
    
    // No need for try/catch here, handled by the mutation hook passed via props
    setLoading(true); // Keep local loading for UI feedback on this specific item
    setSelectedDocument(id);
    onDelete(id); // Call the mutation function passed in props
    // Resetting loading state is handled by the useEffect below
  };

  // Add effect to reset loading when the documents list changes (due to query invalidation)
  // This handles the case where the delete succeeds or fails and data is refetched
  React.useEffect(() => {
    setLoading(false);
    setSelectedDocument(null);
  }, [documents]); // Depend on the documents array

  if (!documents || documents.length === 0) { // Check documents array directly
    return (
      <div className="text-center py-8 text-gray-500">
        No documents found
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {documents.map((doc) => (
        <div
          key={doc.id}
          className="bg-white p-4 rounded-lg shadow relative"
        >
          {/* Pass loading state specific to this item */}
          <LoadingOverlay isLoading={loading && selectedDocument === doc.id} /> 
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-lg font-semibold">{doc.title}</h3>
              {/* Display content snippet safely */}
              <p className="text-gray-600 mt-1 line-clamp-2">{doc.content || ''}</p> 
              <div className="mt-2 text-sm text-gray-500">
                {/* Use optional chaining safely */}
                Created by {doc.createdBy?.name || doc.createdBy?.email || 'Unknown'} on{' '} 
                {new Date(doc.createdAt).toLocaleDateString()}
              </div>
            </div>
            {/* Check ownership using userId from session */}
            {session?.user?.id === doc.userId && onDelete && ( 
              <button
                onClick={() => handleDelete(doc.id)}
                className="text-red-600 hover:text-red-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                // Disable button while this specific item is being deleted
                disabled={loading && selectedDocument === doc.id} 
              >
                Delete
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
