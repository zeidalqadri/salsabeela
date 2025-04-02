import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ExtractedDatum } from '@/modules/document-extraction/types';
import { toast } from '@/components/ui/use-toast';

interface UseDocumentExtractionProps {
  documentId: string;
}

export function useDocumentExtraction({ documentId }: UseDocumentExtractionProps) {
  const queryClient = useQueryClient();

  // Query for fetching extracted data
  const {
    data: extractedData,
    isLoading: isLoadingExtractedData,
    error: extractedDataError,
  } = useQuery<ExtractedDatum[]>({
    queryKey: ['extractedData', documentId],
    queryFn: async () => {
      const response = await fetch(`/api/documents/${documentId}/extracted-data`);
      if (!response.ok) {
        throw new Error('Failed to fetch extracted data');
      }
      return response.json();
    },
  });

  // Mutation for triggering extraction
  const {
    mutate: extractInformation,
    isLoading: isExtracting,
    error: extractionError,
  } = useMutation({
    mutationFn: async () => {
      const response = await fetch(`/api/documents/${documentId}/extract`, {
        method: 'POST',
      });
      if (!response.ok) {
        throw new Error('Failed to extract information');
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['extractedData', documentId] });
      toast({
        title: 'Success',
        description: 'Information extracted successfully',
      });
    },
    onError: (error: Error) => {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error.message || 'Failed to extract information',
      });
    },
  });

  return {
    extractedData,
    isLoadingExtractedData,
    extractedDataError,
    extractInformation,
    isExtracting,
    extractionError,
  };
} 