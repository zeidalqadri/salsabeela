'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useParams } from 'next/navigation';
import { useSocket } from '@/lib/socket';

interface CollaborationProviderProps {
  children: React.ReactNode;
}

export function CollaborationProvider({ children }: CollaborationProviderProps) {
  const { id: documentId } = useParams();
  const { data: session } = useSession();
  const socket = useSocket();
  const [collaborators, setCollaborators] = useState([]);

  useEffect(() => {
    if (!socket || !documentId || !session?.user) return;

    // Join document room
    socket.emit('join-document', { documentId, userId: session.user.id });

    // Listen for collaborator updates
    socket.on('collaborators-updated', (updatedCollaborators) => {
      setCollaborators(updatedCollaborators);
    });

    // Cleanup on unmount
    return () => {
      socket.emit('leave-document', { documentId, userId: session.user.id });
      socket.off('collaborators-updated');
    };
  }, [socket, documentId, session]);

  return (
    <>
      {children}
      <div className="fixed bottom-4 right-4 flex gap-2">
        {collaborators.map((collaborator) => (
          <div key={collaborator.id} className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full" />
            <span className="text-sm">{collaborator.name}</span>
          </div>
        ))}
      </div>
    </>
  );
} 