// src/lib/extractionSchemas.ts

// Schema for extracting Key Dates
export const keyDatesSchema = {
  type: "object",
  properties: {
    keyDates: {
      type: "array",
      description: "List of key dates relevant to project milestones, deadlines, contractual obligations, or significant events mentioned in the document. Focus on explicitly stated dates with clear context.",
      items: {
        type: "object",
        properties: {
          date: {
            type: "string",
            format: "date",
            description: "The specific date identified, formatted as YYYY-MM-DD if possible. Extract the date value itself."
          },
          description: {
            type: "string",
            description: "A concise description of what this date represents (e.g., 'Contract Start Date', 'Final Delivery Deadline', 'Inspection Due', 'Meeting Date', 'Report Date'). Infer this from the surrounding text."
          },
          contextSnippet: {
            type: "string",
            description: "A short text snippet (approx. 10-20 words) from the document showing the context around the extracted date."
          }
        },
        required: ["date", "description"]
      }
    }
  },
  required: ["keyDates"]
};

// Schema for extracting Financial Data
export const financialDataSchema = {
  type: "object",
  properties: {
    financialData: {
      type: "array",
      description: "List of significant financial figures, costs, values, or amounts mentioned in the document. Focus on explicitly stated monetary values.",
      items: {
        type: "object",
        properties: {
          amount: {
            // Using string initially for robustness against parsing issues by LLM
            type: "string",
            description: "The numerical value identified, including decimals but excluding currency symbols or text (e.g., '150000.00', '2500.50')."
          },
          currency: {
            type: "string",
            description: "The currency code (e.g., USD, EUR, MYR) or symbol (e.g., $, €) associated with the amount, if mentioned nearby."
          },
          description: {
            type: "string",
            description: "A concise description of what this amount represents (e.g., 'Total Contract Value', 'Invoice Amount', 'Budget Allocation', 'Variation Order Cost', 'Claim Amount'). Infer this from the surrounding text."
          },
          contextSnippet: { // Corrected key name
            type: "string",
            description: "A short text snippet (approx. 10-20 words) from the document showing the context around the extracted amount."
          }
        },
        required: ["amount", "description"]
      }
    }
  },
  required: ["financialData"]
};

// Schema for extracting Key Entities
export const keyEntitiesSchema = {
  type: "object",
  properties: {
    keyEntities: {
      type: "array",
      description: "List of key named entities mentioned in the document, such as companies, projects, contract numbers, specific locations (platforms, fields), or specific equipment types relevant to EPCIC.",
      items: {
        type: "object",
        properties: { // Corrected key name
          name: {
            type: "string",
            description: "The proper name of the entity identified (e.g., 'Petronas Carigali', 'Gumusut-Kakap Project', 'Contract No. 12345', 'Subsea Manifold XYZ-100')."
          },
          type: {
            type: "string",
            description: "The type of entity. Choose from: 'Company', 'Project', 'Contract', 'Location', 'Equipment', 'Person', 'Organization', 'Document ID', 'Standard'."
          },
           contextSnippet: {
             type: "string",
             description: "A short text snippet (approx. 10-20 words) from the document showing the context around the extracted entity."
           }
        },
        required: ["name", "type"]
      }
    }
  },
  required: ["keyEntities"]
};

/**
 * Schema for extracting generic content from documents
 * This includes summaries, main topics, etc.
 */
export const genericContentSchema = {
  content: {
    description: "Extract a comprehensive summary of the document",
    type: "string",
    required: true,
    context: {
      snippetCount: 1
    }
  }
};

export type ExtractedDatum = {
  type: "actionItem" | "keyDate" | "financialFigure" | "risk" | "clientMention";
  content: string;
  metadata?: {
    assignedTo?: string;
    deadline?: string;
    amount?: number;
    currency?: string;
    client?: string;
    sentiment?: "positive" | "neutral" | "negative";
  };
};

// Combine all schemas for export
export default {
  keyDatesSchema,
  financialDataSchema,
  keyEntitiesSchema,
  genericContentSchema
};
