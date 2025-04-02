import { useState } from 'react';
import { Document as DocumentType } from '@prisma/client';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface DocumentViewerProps {
  document: DocumentType & {
    createdBy: {
      name: string | null;
      email: string;
    };
  };
  onVersionChange?: (version: number) => void;
}

export function DocumentViewer({ document, onVersionChange }: DocumentViewerProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);

  const renderContent = () => {
    const fileType = document.fileType.toLowerCase();

    if (fileType.startsWith('image/')) {
      return (
        <div className="relative w-full h-full min-h-[400px]">
          <img
            src={document.fileUrl}
            alt={document.title}
            className="object-contain w-full h-full"
          />
        </div>
      );
    }

    if (fileType === 'application/pdf') {
      return (
        <iframe
          src={document.fileUrl}
          className="w-full h-full min-h-[600px]"
          title={document.title}
        />
      );
    }

    if (fileType.startsWith('text/') || fileType === 'application/json') {
      return (
        <iframe
          src={document.fileUrl}
          className="w-full h-full min-h-[400px] font-mono"
          title={document.title}
        />
      );
    }

    // For other file types, show download button
    return (
      <div className="flex flex-col items-center justify-center p-8 space-y-4">
        <p className="text-muted-foreground">
          Preview not available for this file type
        </p>
        <Button asChild>
          <a href={document.fileUrl} download={document.title}>
            Download File
          </a>
        </Button>
      </div>
    );
  };

  return (
    <Card className={`overflow-hidden ${isFullscreen ? 'fixed inset-0 z-50' : ''}`}>
      <div className="flex items-center justify-between p-4 border-b">
        <div>
          <h2 className="text-xl font-semibold">{document.title}</h2>
          <p className="text-sm text-muted-foreground">
            Uploaded by {document.createdBy.name || document.createdBy.email}
          </p>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsFullscreen(!isFullscreen)}
        >
          {isFullscreen ? (
            <MinimizeIcon className="w-4 h-4" />
          ) : (
            <MaximizeIcon className="w-4 h-4" />
          )}
        </Button>
      </div>

      <div className={`${isFullscreen ? 'h-[calc(100vh-4rem)]' : ''}`}>
        {renderContent()}
      </div>

      {document.description && (
        <div className="p-4 border-t">
          <p className="text-sm text-muted-foreground">{document.description}</p>
        </div>
      )}
    </Card>
  );
}

function MinimizeIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M8 3v3a2 2 0 0 1-2 2H3" />
      <path d="M21 8h-3a2 2 0 0 1-2-2V3" />
      <path d="M3 16h3a2 2 0 0 1 2 2v3" />
      <path d="M16 21v-3a2 2 0 0 1 2-2h3" />
    </svg>
  );
}

function MaximizeIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <polyline points="15 3 21 3 21 9" />
      <polyline points="9 21 3 21 3 15" />
      <line x1="21" y1="3" x2="14" y2="10" />
      <line x1="3" y1="21" x2="10" y2="14" />
    </svg>
  );
} 