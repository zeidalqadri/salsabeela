"use client"

import { useDocuments } from "@/hooks/useDocuments";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, MoreVertical } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

export function DocumentGrid() {
  const { documents, isLoading } = useDocuments();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[...Array(6)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader className="space-y-2">
              <div className="h-4 bg-muted rounded w-3/4"></div>
              <div className="h-3 bg-muted rounded w-1/2"></div>
            </CardHeader>
            <CardContent>
              <div className="h-20 bg-muted rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {documents?.map((doc) => (
        <Card key={doc.id} className="group relative">
          <Link href={`/documents/${doc.id}`}>
            <CardHeader className="cursor-pointer">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <div className="rounded-md bg-primary/10 p-2">
                    <FileText className="h-4 w-4 text-primary" />
                  </div>
                  <CardTitle className="text-sm font-medium line-clamp-1">
                    {doc.name}
                  </CardTitle>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100"
                    >
                      <MoreVertical className="h-4 w-4" />
                      <span className="sr-only">Open menu</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>Download</DropdownMenuItem>
                    <DropdownMenuItem>Share</DropdownMenuItem>
                    <DropdownMenuItem className="text-destructive">
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                Updated {formatDistanceToNow(new Date(doc.updatedAt))} ago
              </div>
            </CardHeader>
          </Link>
          <CardContent>
            <div className="text-sm text-muted-foreground line-clamp-3">
              {doc.content || 'No preview available'}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
} 