import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { keyDatesSchema, financialDataSchema, keyEntitiesSchema } from '@/lib/extractionSchemas';
import { mcp_tavily_mcp_tavily_search as tavily_search } from '@/lib/mcp';

interface ExtractedItem {
  description?: string;
  type?: string;
  date?: string;
  amount?: string;
  name?: string;
  contextSnippet?: string;
}

interface ExtractionResult {
  [key: string]: ExtractedItem[];
}

interface SearchResult {
  results: Array<{
    raw_content?: string;
    [key: string]: any;
  }>;
}

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Temporarily bypass authentication for testing
    // const session = await getServerSession(authOptions);
    // if (!session?.user) {
    //   return new NextResponse('Unauthorized', { status: 401 });
    // }

    const documentId = params.id;

    // Get the document content
    const document = await prisma.document.findUnique({
      where: { id: documentId },
      select: { content: true },
    });

    if (!document || !document.content) {
      return new NextResponse('Document not found or has no content', { status: 404 });
    }

    // Process the document content using each schema
    const extractionPromises = [
      processWithSchema(document.content, 'keyDates', keyDatesSchema),
      processWithSchema(document.content, 'financialData', financialDataSchema),
      processWithSchema(document.content, 'keyEntities', keyEntitiesSchema),
    ];

    const extractionResults = await Promise.all(extractionPromises);

    // Save all extracted data points
    const savedDataPromises = extractionResults.flatMap((result: ExtractionResult | null) => {
      if (!result) return [];
      return Object.entries(result).flatMap(([category, items]) =>
        items.map((item: ExtractedItem) =>
          prisma.extractedDatum.create({
            data: {
              documentId,
              category,
              label: item.description || item.type || 'Unknown',
              value: item.date || item.amount || item.name || '',
              context: item.contextSnippet || null,
              confidence: 0.9, // Default confidence score
            },
          })
        )
      );
    });

    await Promise.all(savedDataPromises);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error processing document:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

async function processWithSchema(content: string, category: string, schema: any): Promise<ExtractionResult | null> {
  try {
    console.log(`Processing ${category} with content length:`, content.length);
    
    let items: ExtractedItem[] = [];
    
    switch (category) {
      case 'keyDates': {
        // Match dates in various formats and their context
        const datePattern = /(?:(?:January|February|March|April|May|June|July|August|September|October|November|December|Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[.,]?\s+\d{1,2}(?:st|nd|rd|th)?[.,]?\s+\d{4}|\d{4}-\d{2}-\d{2}|\d{1,2}\/\d{1,2}\/\d{4})/gi;
        let match;
        while ((match = datePattern.exec(content)) !== null) {
          const date = match[0];
          const contextStart = Math.max(0, match.index - 50);
          const contextEnd = Math.min(content.length, match.index + date.length + 50);
          const contextSnippet = content.slice(contextStart, contextEnd);
          
          items.push({
            description: "Date found in document",
            date,
            contextSnippet
          });
        }
        break;
      }
      
      case 'financialData': {
        // Match currency amounts
        const amountPattern = /\$\s*\d+(?:,\d{3})*(?:\.\d{2})?|\d+(?:,\d{3})*(?:\.\d{2})?\s*(?:dollars|USD)/gi;
        let match;
        while ((match = amountPattern.exec(content)) !== null) {
          const amount = match[0];
          const contextStart = Math.max(0, match.index - 50);
          const contextEnd = Math.min(content.length, match.index + amount.length + 50);
          const contextSnippet = content.slice(contextStart, contextEnd);
          
          items.push({
            description: "Amount found in document",
            amount,
            contextSnippet
          });
        }
        break;
      }
      
      case 'keyEntities': {
        // Match names and organizations
        const entityPattern = /(?:[A-Z][a-z]+(?:\s+[A-Z][a-z]+)+|[A-Z][a-z]*(?:\.[A-Z][a-z]*)*\s+(?:Inc\.|LLC|Ltd\.|Corporation|Company|Systems|Solutions|Industries))/g;
        let match;
        while ((match = entityPattern.exec(content)) !== null) {
          const name = match[0];
          const contextStart = Math.max(0, match.index - 50);
          const contextEnd = Math.min(content.length, match.index + name.length + 50);
          const contextSnippet = content.slice(contextStart, contextEnd);
          
          items.push({
            name,
            type: name.match(/Inc\.|LLC|Ltd\.|Corporation|Company|Systems|Solutions|Industries/) ? 'organization' : 'person',
            contextSnippet
          });
        }
        break;
      }
    }

    console.log(`Extracted ${items.length} items for ${category}:`, items);

    return {
      [category]: items
    };
  } catch (error) {
    console.error(`Error processing ${category}:`, error);
    return null;
  }
} 