'use client';

import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { UploadCloud } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

interface FileUploaderProps {
  onUpload: (files: File[]) => Promise<void>;
  maxFiles?: number;
  maxSize?: number;
  accept?: Record<string, string[]>;
}

export function FileUploader({ 
  onUpload, 
  maxFiles = 5, 
  maxSize = 10 * 1024 * 1024, // 10MB
  accept = { 'application/pdf': ['.pdf'] }
}: FileUploaderProps) {
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    try {
      setIsUploading(true);
      await onUpload(acceptedFiles);
      toast({
        title: 'Success',
        description: 'Files uploaded successfully',
      });
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: 'Error',
        description: 'Failed to upload files',
        variant: 'destructive'
      });
    } finally {
      setIsUploading(false);
    }
  }, [onUpload, toast]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    maxFiles,
    maxSize,
    accept,
    disabled: isUploading
  });

  return (
    <div 
      {...getRootProps()}
      className={`border-2 border-dashed rounded-lg p-6 text-center ${
        isDragActive ? 'border-primary bg-primary/10' : 'border-muted'
      }`}
    >
      <input {...getInputProps()} />
      <div className="space-y-2">
        <UploadCloud className="w-8 h-8 mx-auto text-muted-foreground" />
        <p className="text-sm text-muted-foreground">
          {isDragActive ? 'Drop files here' : 'Drag & drop files or click to upload'}
        </p>
        <p className="text-xs text-muted-foreground">
          PDF files up to {maxSize / 1024 / 1024}MB
        </p>
        <Button 
          type="button"
          variant="outline"
          disabled={isUploading}
        >
          {isUploading ? 'Uploading...' : 'Select Files'}
        </Button>
      </div>
    </div>
  );
} 