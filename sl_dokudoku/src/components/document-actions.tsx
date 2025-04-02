'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Loader2 } from 'lucide-react';
import { ragClient } from '@/lib/rag-client';

interface DocumentActionsProps {
  documentId: string;
}

export function DocumentActions({ documentId }: DocumentActionsProps) {
  const [showSummary, setShowSummary] = useState(false);
  const [summary, setSummary] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSummarize = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const summary = await ragClient.summarizeDocument(documentId);
      setSummary(summary);
      setShowSummary(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate summary');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Button
        variant="outline"
        onClick={handleSummarize}
        disabled={isLoading}
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Summarizing...
          </>
        ) : (
          'Summarize'
        )}
      </Button>

      <Dialog open={showSummary} onOpenChange={setShowSummary}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Document Summary</DialogTitle>
          </DialogHeader>
          <div className="mt-4">
            {error ? (
              <div className="text-red-500">{error}</div>
            ) : (
              <div className="prose max-w-none">
                <p>{summary}</p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
} 