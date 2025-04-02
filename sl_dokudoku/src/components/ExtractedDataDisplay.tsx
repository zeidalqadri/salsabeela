'use client';

import React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import { ExtractedDatum, ExtractedDatumType } from '@/modules/document-extraction/types';
import { useDocumentExtraction } from '@/hooks/useDocumentExtraction';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';

interface ExtractedDataDisplayProps {
  documentId: string;
}

const formatType = (type: ExtractedDatumType): string => {
  switch (type) {
    case 'actionItem':
      return 'Action Item';
    case 'keyDate':
      return 'Key Date';
    case 'financialFigure':
      return 'Financial Figure';
    case 'risk':
      return 'Risk';
    case 'clientMention':
      return 'Client Mention';
    default:
      return type;
  }
};

export function ExtractedDataDisplay({ documentId }: ExtractedDataDisplayProps) {
  const {
    extractedData,
    isLoadingExtractedData,
    extractedDataError,
    extractInformation,
    isExtracting,
    extractionError,
  } = useDocumentExtraction({ documentId });

  const error = extractedDataError || extractionError;
  const isError = Boolean(error);

  if (isError) {
    return (
      <Card className="bg-destructive/10">
        <CardContent className="pt-6">
          <p className="text-destructive">Error: {error?.message}</p>
        </CardContent>
      </Card>
    );
  }

  const groupedData = extractedData?.reduce((acc: Record<string, ExtractedDatum[]>, datum: ExtractedDatum) => {
    const type = datum.type;
    if (!acc[type]) {
      acc[type] = [];
    }
    acc[type].push(datum);
    return acc;
  }, {});

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Extracted Information</CardTitle>
          <CardDescription>
            Key information extracted from your document
          </CardDescription>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => extractInformation()}
          disabled={isExtracting}
        >
          <RefreshCw
            className={`h-4 w-4 mr-2 ${isExtracting ? 'animate-spin' : ''}`}
          />
          {isExtracting ? 'Extracting...' : 'Extract'}
        </Button>
      </CardHeader>
      <CardContent>
        {isLoadingExtractedData ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-24 w-full" />
            ))}
          </div>
        ) : !groupedData || Object.keys(groupedData).length === 0 ? (
          <p className="text-muted-foreground text-center py-8">
            No data has been extracted yet. Click the Extract button to analyze
            your document.
          </p>
        ) : (
          <ScrollArea className="h-[500px] pr-4">
            <div className="space-y-6">
              {Object.entries(groupedData).map(([type, data]) => (
                <div key={type} className="space-y-3">
                  <h3 className="font-semibold text-lg">{formatType(type as ExtractedDatumType)}</h3>
                  <div className="grid gap-4">
                    {data.map((datum: ExtractedDatum, index: number) => (
                      <Card key={index} className="p-4">
                        <div className="flex flex-col space-y-2">
                          <div className="flex items-center space-x-2">
                            {datum.metadata?.client && (
                              <Badge variant="outline">
                                {datum.metadata.client}
                              </Badge>
                            )}
                            {datum.metadata?.sentiment && (
                              <Badge
                                variant={
                                  datum.metadata.sentiment === 'positive'
                                    ? 'default'
                                    : datum.metadata.sentiment === 'negative'
                                    ? 'destructive'
                                    : 'secondary'
                                }
                              >
                                {datum.metadata.sentiment}
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm">{datum.content}</p>
                          {datum.metadata?.deadline && (
                            <p className="text-xs text-muted-foreground">
                              Deadline: {datum.metadata.deadline}
                            </p>
                          )}
                          {datum.metadata?.amount && (
                            <p className="text-xs text-muted-foreground">
                              Amount: {datum.metadata.amount} {datum.metadata.currency}
                            </p>
                          )}
                          {datum.metadata?.assignedTo && (
                            <p className="text-xs text-muted-foreground">
                              Assigned to: {datum.metadata.assignedTo}
                            </p>
                          )}
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
}
