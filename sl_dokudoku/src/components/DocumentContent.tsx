import React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';
import { ExtractedDataDisplay } from './ExtractedDataDisplay';

interface DocumentContentProps {
  id: string;
  title: string;
  content: string;
}

export function DocumentContent({ id, title, content }: DocumentContentProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card className="w-full">
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription>Document Content</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="prose max-w-none">
            <div className="whitespace-pre-wrap font-mono text-sm">
              {content}
            </div>
          </div>
        </CardContent>
      </Card>
      
      <ExtractedDataDisplay documentId={id} />
    </div>
  );
} 