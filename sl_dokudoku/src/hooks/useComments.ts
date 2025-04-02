import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

interface User {
  id: string;
  name: string | null;
  image: string | null;
}

interface Comment {
  id: string;
  content: string;
  createdAt: string;
  userId: string;
  documentId: string;
  user: User;
}

interface AddCommentData {
  documentId: string;
  content: string;
}

async function fetchComments(documentId: string): Promise<Comment[]> {
  const response = await fetch(`/api/documents/${documentId}/comments`);
  if (!response.ok) {
    throw new Error('Failed to fetch comments');
  }
  return response.json();
}

async function addComment({ documentId, content }: AddCommentData): Promise<Comment> {
  const response = await fetch(`/api/documents/${documentId}/comments`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ content }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to add comment');
  }

  return response.json();
}

async function deleteComment(documentId: string, commentId: string): Promise<void> {
  const response = await fetch(`/api/documents/${documentId}/comments/${commentId}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to delete comment');
  }
}

export function useComments(documentId: string) {
  return useQuery({
    queryKey: ['comments', documentId],
    queryFn: () => fetchComments(documentId),
  });
}

export function useAddComment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addComment,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['comments', variables.documentId] });
      toast.success('Comment added successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
}

export function useDeleteComment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ documentId, commentId }: { documentId: string; commentId: string }) =>
      deleteComment(documentId, commentId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['comments', variables.documentId] });
      toast.success('Comment deleted successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
} 