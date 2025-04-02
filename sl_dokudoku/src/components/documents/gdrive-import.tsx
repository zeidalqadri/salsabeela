'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { Loader2, FolderInput } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export function GDriveImport() {
  const [folderId, setFolderId] = useState('');
  const [isImporting, setIsImporting] = useState(false);
  const { toast } = useToast();

  const handleImport = async () => {
    if (!folderId.trim()) {
      toast({
        title: 'Folder ID Required',
        description: 'Please enter a Google Drive folder ID',
        variant: 'destructive',
      });
      return;
    }

    try {
      setIsImporting(true);
      const response = await fetch('/api/gdrive/import', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ folderId: folderId.trim() }),
      });

      const data = await response.json();
      
      if (!response.ok) throw new Error(data.error || 'Import failed');
      
      toast({
        title: 'Import Successful',
        description: `Imported ${data.count} documents from Google Drive`,
      });

      // Clear the input after successful import
      setFolderId('');
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
      toast({
        title: 'Import Failed',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setIsImporting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FolderInput className="h-5 w-5" />
          Import from Google Drive
        </CardTitle>
        <CardDescription>
          Import documents from a Google Drive folder for processing
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="Enter Google Drive Folder ID"
              value={folderId}
              onChange={(e) => setFolderId(e.target.value)}
              disabled={isImporting}
            />
            <Button 
              onClick={handleImport}
              disabled={isImporting || !folderId.trim()}
            >
              {isImporting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Importing...
                </>
              ) : (
                'Import'
              )}
            </Button>
          </div>
          
          <Alert>
            <AlertTitle>How to get the folder ID</AlertTitle>
            <AlertDescription>
              1. Open your Google Drive folder<br />
              2. Copy the ID from the URL after /folders/<br />
              Example: drive.google.com/drive/folders/<strong>FOLDER_ID</strong>
            </AlertDescription>
          </Alert>
        </div>
      </CardContent>
    </Card>
  );
} 