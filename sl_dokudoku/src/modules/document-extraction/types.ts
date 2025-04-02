import { Prisma } from '@prisma/client';

// Types for document extraction
export type ExtractedDatumType = string;

export interface ExtractedDatumMetadata {
  assignedTo?: string;
  deadline?: string;
  amount?: number;
  currency?: string;
  client?: string;
  sentiment?: "positive" | "neutral" | "negative";
}

// Use Prisma's generated types
export type ExtractedDatum = Prisma.ExtractedDatumGetPayload<{}>;

export interface ExtractionResult {
  success: boolean;
  data?: ExtractedDatum[];
  error?: string;
} 