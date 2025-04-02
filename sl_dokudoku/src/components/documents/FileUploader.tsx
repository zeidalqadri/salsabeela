import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { useUploadDocument } from '@/hooks/useUploadDocument';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { Upload, X } from 'lucide-react';

interface FileUploaderProps {
  folderId?: string;
  tagIds?: string[];
  onUploadComplete?: () => void;
}

export function FileUploader({ folderId, tagIds, onUploadComplete }: FileUploaderProps) {
  const [files, setFiles] = useState<File[]>([]);
  const { upload, isUploading, progress } = useUploadDocument();

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setFiles(prev => [...prev, ...acceptedFiles]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'text/plain': ['.txt'],
      'text/markdown': ['.md'],
    },
    maxSize: 10 * 1024 * 1024, // 10MB
  });

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleUpload = async () => {
    if (files.length === 0) {
      toast.error('Please select files to upload');
      return;
    }

    try {
      for (const file of files) {
        await upload({ file, folderId, tagIds });
      }
      setFiles([]);
      onUploadComplete?.();
    } catch (error) {
      console.error('Upload error:', error);
    }
  };

  return (
    <div className="w-full space-y-4">
      <div
        {...getRootProps()}
        className={cn(
          'border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors',
          isDragActive ? 'border-primary bg-primary/10' : 'border-border',
          isUploading && 'pointer-events-none opacity-50'
        )}
      >
        <input {...getInputProps()} />
        <Upload className="mx-auto h-12 w-12 text-muted-foreground" />
        <p className="mt-2 text-sm text-muted-foreground">
          Drag & drop files here, or click to select files
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          PDF, DOC, DOCX, TXT, MD (Max 10MB)
        </p>
      </div>

      {files.length > 0 && (
        <div className="space-y-2">
          {files.map((file, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-2 bg-muted rounded-md"
            >
              <div className="flex items-center space-x-2">
                <span className="text-sm truncate max-w-[200px]">{file.name}</span>
                <span className="text-xs text-muted-foreground">
                  ({(file.size / 1024 / 1024).toFixed(2)} MB)
                </span>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => removeFile(index)}
                disabled={isUploading}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      )}

      {isUploading && (
        <div className="space-y-2">
          <Progress value={progress.percentage} />
          <p className="text-xs text-center text-muted-foreground">
            Uploading... {progress.percentage}%
          </p>
        </div>
      )}

      {files.length > 0 && (
        <Button
          className="w-full"
          onClick={handleUpload}
          disabled={isUploading}
        >
          {isUploading ? 'Uploading...' : `Upload ${files.length} file${files.length === 1 ? '' : 's'}`}
        </Button>
      )}
    </div>
  );
} 