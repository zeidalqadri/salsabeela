import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { toast } from 'sonner';

interface UploadProgress {
  loaded: number;
  total: number;
  percentage: number;
}

interface UploadDocumentOptions {
  file: File;
  folderId?: string;
  tagIds?: string[];
}

export function useUploadDocument() {
  const queryClient = useQueryClient();
  const [progress, setProgress] = useState<UploadProgress>({
    loaded: 0,
    total: 0,
    percentage: 0,
  });

  const uploadDocument = async ({ file, folderId, tagIds }: UploadDocumentOptions) => {
    const formData = new FormData();
    formData.append('file', file);
    if (folderId) formData.append('folderId', folderId);
    if (tagIds?.length) {
      tagIds.forEach(id => formData.append('tagIds', id));
    }

    const xhr = new XMLHttpRequest();
    
    return new Promise((resolve, reject) => {
      xhr.upload.addEventListener('progress', (event) => {
        if (event.lengthComputable) {
          const percentage = Math.round((event.loaded * 100) / event.total);
          setProgress({
            loaded: event.loaded,
            total: event.total,
            percentage,
          });
        }
      });

      xhr.addEventListener('load', () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          resolve(JSON.parse(xhr.response));
        } else {
          reject(new Error(xhr.response));
        }
      });

      xhr.addEventListener('error', () => {
        reject(new Error('Upload failed'));
      });

      xhr.open('POST', '/api/upload');
      xhr.send(formData);
    });
  };

  const mutation = useMutation({
    mutationFn: uploadDocument,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documents'] });
      toast.success('Document uploaded successfully');
      setProgress({ loaded: 0, total: 0, percentage: 0 });
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to upload document');
      setProgress({ loaded: 0, total: 0, percentage: 0 });
    },
  });

  return {
    upload: mutation.mutate,
    uploadAsync: mutation.mutateAsync,
    isUploading: mutation.isPending,
    progress,
  };
} 