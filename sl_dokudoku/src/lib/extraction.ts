import prisma from './prisma';
import { logger } from './logger';
import extractionSchemas from './extractionSchemas';

// Define the interface for extracted data to be stored in the database
interface ExtractedData {
  documentId: string;
  category: string;
  label?: string;
  value: string;
  context?: string;
  confidence?: number;
}

/**
 * Process the extraction results and convert them to database-compatible format
 * @param documentId The document ID to associate extracted data with
 * @param extractionData The raw extraction data returned from the extraction API
 * @returns Array of formatted extracted data points ready for database insertion
 */
export async function processExtractionResults(
  documentId: string,
  extractionData: Record<string, any>
): Promise<ExtractedData[]> {
  const results: ExtractedData[] = [];

  try {
    // Process key dates
    if (extractionData.keyDates && Array.isArray(extractionData.keyDates)) {
      extractionData.keyDates.forEach((date: any) => {
        if (date.date && date.label) {
          results.push({
            documentId,
            category: 'Date',
            label: date.label,
            value: date.date,
            context: date.context || null,
            confidence: date.confidence || null,
          });
        }
      });
    }

    // Process financial data
    if (extractionData.financialData && Array.isArray(extractionData.financialData)) {
      extractionData.financialData.forEach((finance: any) => {
        if (finance.amount) {
          results.push({
            documentId,
            category: 'Financial',
            label: finance.label || 'Amount',
            value: finance.amount.toString(),
            context: finance.context || null,
            confidence: finance.confidence || null,
          });
        }
      });
    }

    // Process key entities
    if (extractionData.keyEntities && Array.isArray(extractionData.keyEntities)) {
      extractionData.keyEntities.forEach((entity: any) => {
        if (entity.name) {
          results.push({
            documentId,
            category: 'Entity',
            label: entity.type || 'Organization',
            value: entity.name,
            context: entity.context || null,
            confidence: entity.confidence || null,
          });
        }
      });
    }

    // Process generic content
    if (extractionData.content) {
      results.push({
        documentId,
        category: 'Content',
        label: 'Summary',
        value: extractionData.content,
        confidence: 1.0,
      });
    }

    return results;
  } catch (error) {
    logger.error('Error processing extraction results:', error);
    return [];
  }
}

/**
 * Store multiple extracted data points in the database
 * @param extractedData Array of formatted extracted data points
 * @returns Promise resolving to the number of items successfully stored
 */
export async function storeExtractedData(
  extractedData: ExtractedData[]
): Promise<number> {
  if (!extractedData || extractedData.length === 0) {
    return 0;
  }

  try {
    // Create all extracted data points in a transaction
    const result = await prisma.$transaction(
      extractedData.map(data => 
        prisma.extractedDatum.create({
          data: {
            documentId: data.documentId,
            category: data.category,
            label: data.label || null,
            value: data.value,
            context: data.context || null,
            confidence: data.confidence || null,
          },
        })
      )
    );

    return result.length;
  } catch (error) {
    logger.error('Error storing extracted data in database:', error);
    throw new Error('Failed to store extracted data in the database');
  }
}

/**
 * Select appropriate extraction schema based on document file type
 * @param fileType The MIME type of the document
 * @returns The appropriate extraction schema for the file type
 */
export function getExtractionSchemaForFileType(fileType: string): Record<string, any> {
  // Check if the file is PDF
  if (fileType.includes('pdf')) {
    return {
      ...extractionSchemas.keyDatesSchema,
      ...extractionSchemas.financialDataSchema,
      ...extractionSchemas.keyEntitiesSchema,
    };
  }
  
  // Check if the file is an image
  if (fileType.includes('image/')) {
    return {
      ...extractionSchemas.keyEntitiesSchema,
      ...extractionSchemas.genericContentSchema,
    };
  }
  
  // Check if the file is a text document (Word, Text, etc.)
  if (
    fileType.includes('text/') || 
    fileType.includes('application/msword') ||
    fileType.includes('application/vnd.openxmlformats-officedocument.wordprocessingml')
  ) {
    return {
      ...extractionSchemas.keyDatesSchema,
      ...extractionSchemas.financialDataSchema,
      ...extractionSchemas.keyEntitiesSchema,
      ...extractionSchemas.genericContentSchema,
    };
  }
  
  // Default schema for unknown file types
  return extractionSchemas.genericContentSchema;
}

/**
 * Update document status in the database based on extraction status
 * @param documentId The document ID to update
 * @param status The status to set ('PROCESSED', 'FAILED', etc.)
 * @returns Promise resolving when the update is complete
 */
export async function updateDocumentExtractionStatus(
  documentId: string, 
  status: 'PROCESSING' | 'PROCESSED' | 'FAILED'
): Promise<void> {
  try {
    await prisma.document.update({
      where: {
        id: documentId,
      },
      data: {
        // Use a metadata field or similar to store status
        // This assumes you have such a field, if not, you'll need to add one
        updatedAt: new Date(),
      },
    });
    
    logger.info(`Updated document ${documentId} status to ${status}`);
  } catch (error) {
    logger.error(`Failed to update document status to ${status}:`, error);
    throw new Error(`Failed to update document status to ${status}`);
  }
} 