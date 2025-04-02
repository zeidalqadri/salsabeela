import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { AlertCircle } from 'lucide-react';

const ALLOWED_FILE_TYPES = {
  'application/pdf': ['.pdf'],
  'image/jpeg': ['.jpg', '.jpeg'],
  'image/png': ['.png'],
  'image/gif': ['.gif'],
  'text/plain': ['.txt'],
  'application/json': ['.json'],
  'application/msword': ['.doc'],
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
  'application/vnd.ms-excel': ['.xls'],
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx']
};

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

interface DocumentUploadProps {
  onUploadComplete?: (document: any) => void;
}

export function DocumentUpload({ onUploadComplete }: DocumentUploadProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [uploading, setUploading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);

  const validateFile = (file: File): string | null => {
    if (file.size > MAX_FILE_SIZE) {
      return 'File size exceeds 10MB limit';
    }

    const fileType = file.type || 'application/octet-stream';
    if (!ALLOWED_FILE_TYPES[fileType as keyof typeof ALLOWED_FILE_TYPES]) {
      return 'File type not supported';
    }

    return null;
  };

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setError(null);
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      const validationError = validateFile(file);
      
      if (validationError) {
        setError(validationError);
        return;
      }

      setFile(file);
      if (!title) {
        setTitle(file.name.split('.')[0]);
      }
    }
  }, [title]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    maxFiles: 1,
    accept: Object.entries(ALLOWED_FILE_TYPES).reduce((acc, [mimeType, extensions]) => {
      acc[mimeType] = extensions;
      return acc;
    }, {} as Record<string, string[]>),
    maxSize: MAX_FILE_SIZE
  });

  const handleUpload = async () => {
    if (!file || !title) return;

    try {
      setUploading(true);
      setError(null);

      // Create form data
      const formData = new FormData();
      formData.append('file', file);
      formData.append('title', title);
      formData.append('description', description);

      // Upload file
      const uploadResponse = await fetch('/api/documents/upload', {
        method: 'POST',
        body: formData,
      });

      if (!uploadResponse.ok) {
        const errorData = await uploadResponse.json();
        throw new Error(errorData.error || 'Failed to upload document');
      }

      const document = await uploadResponse.json();
      
      toast.success('Document uploaded successfully');
      onUploadComplete?.(document);
      
      // Reset form
      setFile(null);
      setTitle('');
      setDescription('');
      setError(null);
    } catch (error) {
      console.error('Upload error:', error);
      setError(error instanceof Error ? error.message : 'Failed to upload document');
      toast.error('Failed to upload document');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-6 space-y-6">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
          ${isDragActive ? 'border-primary bg-primary/5' : error ? 'border-destructive' : 'border-border'}`}
      >
        <input {...getInputProps()} />
        {file ? (
          <div className="space-y-2">
            <p className="text-sm font-medium">{file.name}</p>
            <p className="text-xs text-muted-foreground">
              {(file.size / 1024 / 1024).toFixed(2)} MB
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            <p className="text-sm font-medium">
              {isDragActive ? 'Drop the file here' : 'Drag & drop a file here'}
            </p>
            <p className="text-xs text-muted-foreground">
              or click to select a file
            </p>
            <p className="text-xs text-muted-foreground mt-2">
              Supported formats: PDF, JPEG, PNG, GIF, TXT, DOC, DOCX, XLS, XLSX
              <br />
              Maximum size: 10MB
            </p>
          </div>
        )}
      </div>

      {error && (
        <div className="flex items-center gap-2 text-sm text-destructive">
          <AlertCircle className="w-4 h-4" />
          <p>{error}</p>
        </div>
      )}

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Document title"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Document description (optional)"
          />
        </div>

        <Button
          onClick={handleUpload}
          disabled={!file || !title || uploading}
          className="w-full"
        >
          {uploading ? 'Uploading...' : 'Upload Document'}
        </Button>
      </div>
    </div>
  );
} 