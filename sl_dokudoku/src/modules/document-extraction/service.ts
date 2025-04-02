import { prisma } from '@/lib/prisma';
import { ExtractedDatum, ExtractedDatumType, ExtractionResult } from './types';
import { Prisma } from '@prisma/client';

interface LLMExtractedDatum {
  type: string;
  content: string;
  metadata?: Record<string, unknown>;
}

interface LLMResponse {
  extractedData: LLMExtractedDatum[];
}

// TODO: Replace with actual LiteLLM implementation
// For now, we'll use a simple fetch to an API endpoint
async function callLLMAPI(prompt: string) {
  const response = await fetch('https://api.litellm.ai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.LITELLM_API_KEY}`,
    },
    body: JSON.stringify({
      messages: [{ role: 'user', content: prompt }],
      model: 'gpt-4',
      temperature: 0.2,
      response_format: { type: 'json_object' },
    }),
  });

  if (!response.ok) {
    throw new Error(`API call failed: ${response.statusText}`);
  }

  const data = await response.json();
  return data;
}

export class DocumentExtractionService {
  private static instance: DocumentExtractionService;

  private constructor() {}

  public static getInstance(): DocumentExtractionService {
    if (!DocumentExtractionService.instance) {
      DocumentExtractionService.instance = new DocumentExtractionService();
    }
    return DocumentExtractionService.instance;
  }

  public async extractInformation(
    documentId: string,
    content: string
  ): Promise<ExtractionResult> {
    try {
      const prompt = `
        Extract key information from the following document content.
        Focus on:
        1. Action items (tasks, todos, requirements)
        2. Key dates (deadlines, milestones, meetings)
        3. Financial figures (amounts, budgets, costs)
        4. Risks (potential issues, concerns, blockers)
        5. Client mentions (company names, stakeholders)

        For each extracted piece of information, provide:
        - Type (one of: actionItem, keyDate, financialFigure, risk, clientMention)
        - Content (the actual information)
        - Metadata (relevant context like assignee, deadline, amount, currency, client name, sentiment)

        Document content:
        ${content}

        Return the information in JSON format like this:
        {
          "extractedData": [
            {
              "type": "actionItem",
              "content": "Complete project documentation",
              "metadata": {
                "assignedTo": "John",
                "deadline": "2024-04-15"
              }
            },
            {
              "type": "financialFigure",
              "content": "Project budget approved",
              "metadata": {
                "amount": 50000,
                "currency": "USD"
              }
            }
          ]
        }
      `;

      const response = await callLLMAPI(prompt);
      const extractedData = JSON.parse(response.choices[0].message.content) as LLMResponse;

      // Save to database using Prisma create
      const savedData = await Promise.all(
        extractedData.extractedData.map(async (datum) => {
          const createData: Prisma.ExtractedDatumCreateInput = {
            type: datum.type,
            content: datum.content,
            metadata: datum.metadata as Prisma.JsonValue,
            document: {
              connect: {
                id: documentId
              }
            }
          };

          return prisma.extractedDatum.create({
            data: createData
          });
        })
      );

      return {
        success: true,
        data: savedData,
      };
    } catch (error) {
      console.error('Error in document extraction:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  public async getExtractedData(documentId: string): Promise<ExtractedDatum[]> {
    const data = await prisma.extractedDatum.findMany({
      where: {
        documentId,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return data;
  }
} 