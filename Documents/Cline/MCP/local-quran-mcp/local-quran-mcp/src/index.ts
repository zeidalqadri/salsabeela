#!/usr/bin/env node

// Load environment variables from .env file
import dotenv from 'dotenv';
dotenv.config();

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  McpError,
  ErrorCode,
  CallToolResultSchema, // Correct import name
} from "@modelcontextprotocol/sdk/types.js";
import * as fs from 'fs/promises';
import * as path from 'path';
import { XMLParser } from 'fast-xml-parser';
import express, { Request, Response } from 'express';
import cors from 'cors';
import Firecrawl from '@mendable/firecrawl-js';
// Import FlexSearch correctly
import FlexSearch from 'flexsearch';

// --- Configuration ---
const QURAN_XML_PATH = '/Users/zeidalqadri/salsabeela/quran-uthmani.xml';
const MORPHOLOGY_TXT_PATH = '/Users/zeidalqadri/salsabeela/quranic-corpus-morphology-0.4.txt';
const SERVER_NAME = 'salsabeela';
const SERVER_VERSION = '0.3.3'; // Incremented version for FlexSearch final fix
const HTTP_PORT = 3001;

// --- Firecrawl Client ---
const FIRECRAWL_API_KEY = process.env.FIRECRAWL_API_KEY;
if (!FIRECRAWL_API_KEY) {
    console.error("Error: FIRECRAWL_API_KEY environment variable not set.");
    process.exit(1);
}
const firecrawl = new Firecrawl({ apiKey: FIRECRAWL_API_KEY });


// --- Data Structures ---
interface Ayah {
  index: number;
  text: string;
  bismillah?: string;
}

interface Surah {
  index: number;
  name: string;
  ayahs: Map<number, Ayah>;
}

const quranData: Map<number, Surah> = new Map();
const rootIndex: Map<string, { surah: number; ayah: number }[]> = new Map();
const lemmaIndex: Map<string, { surah: number; ayah: number }[]> = new Map();

interface SegmentAnalysis {
    location: string;
    form: string;
    tag: string;
    features: string;
}
const verseMorphology: Map<string, SegmentAnalysis[]> = new Map();

// --- FlexSearch Index ---
interface AyahDocument {
    id: string; // "S:A"
    sura: number;
    ayah: number;
    text: string;
}
// Initialize FlexSearch Document index - Remove generic type argument
const ayahTextIndex = new FlexSearch.Document({
    document: {
        id: "id",
        index: ["text"],
        store: true // Store the full document
    },
    // charset: "utf-8", // Removed as it caused TS error
    tokenize: "forward" // Simple tokenizer suitable for exact phrase matching
});


// --- Data Loading ---
async function loadQuranData() {
  console.error(`Loading Quran XML from ${QURAN_XML_PATH}...`);
  try {
    const xmlData = await fs.readFile(QURAN_XML_PATH, 'utf-8');
    const parser = new XMLParser({
      ignoreAttributes: false,
      attributeNamePrefix: "",
      parseAttributeValue: true,
      allowBooleanAttributes: true,
    });
    const jsonObj = parser.parse(xmlData);

    if (!jsonObj.quran || !jsonObj.quran.sura) {
        throw new Error("Invalid Quran XML structure: missing quran or sura tags");
    }

    const suras = Array.isArray(jsonObj.quran.sura) ? jsonObj.quran.sura : [jsonObj.quran.sura];
    let indexedCount = 0;

    for (const suraNode of suras) {
      if (!suraNode.aya || typeof suraNode.index !== 'number' || typeof suraNode.name !== 'string') {
          console.warn(`Skipping invalid sura structure: ${JSON.stringify(suraNode)}`);
          continue;
      }
      const surahIndex = suraNode.index;
      const currentSurah: Surah = {
        index: surahIndex,
        name: suraNode.name,
        ayahs: new Map(),
      };

      const ayahs = Array.isArray(suraNode.aya) ? suraNode.aya : [suraNode.aya];
      for (const ayaNode of ayahs) {
         if (typeof ayaNode.index !== 'number' || typeof ayaNode.text !== 'string') {
             console.warn(`Skipping invalid aya structure in Surah ${surahIndex}: ${JSON.stringify(ayaNode)}`);
             continue;
         }
         const ayahObj: Ayah = {
             index: ayaNode.index,
             text: ayaNode.text,
             bismillah: ayaNode.bismillah,
         };
        currentSurah.ayahs.set(ayaNode.index, ayahObj);

        // Add to FlexSearch index
        const ayahKey = `${surahIndex}:${ayaNode.index}`;
        const doc: AyahDocument = {
            id: ayahKey,
            sura: surahIndex,
            ayah: ayaNode.index,
            text: ayaNode.text
        };
        // Use add(id, document) format - Cast doc to 'any' to bypass strict type check
         ayahTextIndex.add(ayahKey, doc as any);
        indexedCount++;
      }
      quranData.set(surahIndex, currentSurah);
    }
    console.error(`Loaded ${quranData.size} Surahs from XML.`);
    console.error(`Indexed ${indexedCount} Ayahs for text search.`);

  } catch (error) {
    console.error(`Error loading Quran XML: ${error}`);
    throw new Error(`Failed to load Quran data from ${QURAN_XML_PATH}`);
  }
}

// --- loadMorphologyData remains the same ---
async function loadMorphologyData() {
    console.error(`Loading morphology data from ${MORPHOLOGY_TXT_PATH}...`);
    let processedLines = 0;
    try {
        const txtData = await fs.readFile(MORPHOLOGY_TXT_PATH, 'utf-8');
        const lines = txtData.split('\n');
        const ayahRootMap = new Map<string, Set<string>>();
        const ayahLemmaMap = new Map<string, Set<string>>();

        for (const line of lines) {
            if (line.startsWith('#') || line.startsWith('LOCATION') || line.trim() === '') continue;
            const parts = line.split('\t');
            if (parts.length < 4) continue;
            const location = parts[0], form = parts[1], tag = parts[2], features = parts[3];
            const locMatch = location.match(/\((\d+):(\d+):(\d+):(\d+)\)/);
            if (!locMatch) continue;
            const [, surahStr, ayahStr ] = locMatch;
            const surah = parseInt(surahStr, 10);
            const ayah = parseInt(ayahStr, 10);
            const ayahKey = `${surah}:${ayah}`;

            const rootMatch = features.match(/ROOT:([^\s|]+)/);
            if (rootMatch) {
                const root = rootMatch[1];
                if (!ayahRootMap.has(ayahKey)) ayahRootMap.set(ayahKey, new Set());
                ayahRootMap.get(ayahKey)?.add(root);
            }
            const lemmaMatch = features.match(/LEM:([^\s|]+)/);
             if (lemmaMatch) {
                const lemma = lemmaMatch[1];
                if (!ayahLemmaMap.has(ayahKey)) ayahLemmaMap.set(ayahKey, new Set());
                ayahLemmaMap.get(ayahKey)?.add(lemma);
            }
            const segmentData: SegmentAnalysis = { location, form, tag, features };
            if (!verseMorphology.has(ayahKey)) verseMorphology.set(ayahKey, []);
            verseMorphology.get(ayahKey)?.push(segmentData);
            processedLines++;
        }
        for (const [ayahKey, roots] of ayahRootMap.entries()) {
            const [surahStr, ayahStr] = ayahKey.split(':');
            const surah = parseInt(surahStr, 10); const ayah = parseInt(ayahStr, 10);
            const location = { surah, ayah };
            for (const root of roots) {
                if (!rootIndex.has(root)) rootIndex.set(root, []);
                const locations = rootIndex.get(root);
                if (!locations?.some(loc => loc.surah === surah && loc.ayah === ayah)) locations?.push(location);
            }
        }
        for (const [ayahKey, lemmas] of ayahLemmaMap.entries()) {
            const [surahStr, ayahStr] = ayahKey.split(':');
            const surah = parseInt(surahStr, 10); const ayah = parseInt(ayahStr, 10);
            const location = { surah, ayah };
            for (const lemma of lemmas) {
                if (!lemmaIndex.has(lemma)) lemmaIndex.set(lemma, []);
                const locations = lemmaIndex.get(lemma);
                if (!locations?.some(loc => loc.surah === surah && loc.ayah === ayah)) locations?.push(location);
            }
        }
        console.error(`Processed ${processedLines} morphology lines. Indexed ${rootIndex.size} unique roots, ${lemmaIndex.size} unique lemmas, and morphology for ${verseMorphology.size} Ayahs.`);
    } catch (error) {
        console.error(`Error loading morphology data: ${error}`);
        throw new Error(`Failed to load morphology data from ${MORPHOLOGY_TXT_PATH}`);
    }
}


// --- MCP Server Setup ---
const mcpServer = new Server(
  { name: SERVER_NAME, version: SERVER_VERSION },
  { capabilities: { resources: {}, tools: {}, prompts: {} } }
);

// --- Tool Definitions ---
const firecrawlToolDefinition = {
    name: "firecrawl-research",
    description: "Perform deep research on a query using Firecrawl",
    inputSchema: { type: "object", properties: { query: { type: "string" }, maxDepth: { type: "number" }, timeLimit: { type: "number" }, maxUrls: { type: "number" } }, required: ["query"] }
};
const searchExactPhraseToolDefinition = {
    name: "search-exact-phrase",
    description: "Search for Ayahs containing an exact phrase",
    inputSchema: {
        type: "object",
        properties: {
            phrase_query: { type: "string", description: "The exact phrase to search for" }
        },
        required: ["phrase_query"]
    }
};

mcpServer.setRequestHandler(ListToolsRequestSchema, async () => {
  const getAyahSchema = { type: "object", properties: { surah_index: { type: "number" }, ayah_index: { type: "number" } }, required: ["surah_index", "ayah_index"] };
  const getSurahInfoSchema = { type: "object", properties: { surah_index: { type: "number" } }, required: ["surah_index"] };
  const searchArabiyanSchema = { type: "object", properties: { root_query: { type: "string" } }, required: ["root_query"] };
  const searchLemmaSchema = { type: "object", properties: { lemma_query: { type: "string" } }, required: ["lemma_query"] };
  const getVerseAnalysisSchema = { type: "object", properties: { surah_index: { type: "number" }, ayah_index: { type: "number" } }, required: ["surah_index", "ayah_index"] };

  return {
    tools: [
      { name: "get-ayah", description: "Get the text of a specific Ayah", inputSchema: getAyahSchema },
      { name: "get-surah-info", description: "Get information about a specific Surah", inputSchema: getSurahInfoSchema },
      { name: "search-arabiyan", description: "Search for Ayahs containing a specific Arabic root word", inputSchema: searchArabiyanSchema },
      { name: "search-lemma", description: "Search for Ayahs containing a specific Arabic lemma", inputSchema: searchLemmaSchema },
      { name: "get-verse-analysis", description: "Get the morphological analysis for an Ayah", inputSchema: getVerseAnalysisSchema },
      searchExactPhraseToolDefinition,
      firecrawlToolDefinition
    ]
  };
});

// --- Tool Implementation Logic ---
async function executeMcpTool(toolName: string, args: any): Promise<any> {
     if (toolName !== firecrawlToolDefinition.name && (quranData.size === 0 || rootIndex.size === 0 || lemmaIndex.size === 0 || verseMorphology.size === 0 || !ayahTextIndex)) {
        throw new McpError(ErrorCode.InternalError, "Server Quran data is not loaded yet. Please wait and try again.");
    }

    switch (toolName) {
        case "get-ayah": {
            const surahIndex = Number(args?.surah_index);
            const ayahIndex = Number(args?.ayah_index);
            if (isNaN(surahIndex) || isNaN(ayahIndex)) throw new McpError(ErrorCode.InvalidParams, "surah_index and ayah_index must be numbers.");
            const surah = quranData.get(surahIndex);
            const ayah = surah?.ayahs.get(ayahIndex);
            if (!ayah) throw new McpError(ErrorCode.InvalidRequest, `Ayah ${surahIndex}:${ayahIndex} not found.`);
            return ayah.text;
        }
        case "get-surah-info": {
            const surahIndex = Number(args?.surah_index);
            if (isNaN(surahIndex)) throw new McpError(ErrorCode.InvalidParams, "surah_index must be a number.");
            const surah = quranData.get(surahIndex);
            if (!surah) throw new McpError(ErrorCode.InvalidRequest, `Surah ${surahIndex} not found.`);
            return { index: surah.index, name: surah.name, ayah_count: surah.ayahs.size };
        }
        case "search-arabiyan": {
            const rootQuery = String(args?.root_query).trim();
            if (!rootQuery) throw new McpError(ErrorCode.InvalidParams, "root_query cannot be empty.");
            const locations = rootIndex.get(rootQuery);
            if (!locations || locations.length === 0) return [];
            return locations.map(loc => {
                const surah = quranData.get(loc.surah);
                const ayah = surah?.ayahs.get(loc.ayah);
                return ayah ? { surah: loc.surah, ayah: loc.ayah, text: ayah.text } : null;
            }).filter(result => result !== null);
        }
        case "search-lemma": {
            const lemmaQuery = String(args?.lemma_query).trim();
            if (!lemmaQuery) throw new McpError(ErrorCode.InvalidParams, "lemma_query cannot be empty.");
            const locations = lemmaIndex.get(lemmaQuery);
            if (!locations || locations.length === 0) return [];
            return locations.map(loc => {
                const surah = quranData.get(loc.surah);
                const ayah = surah?.ayahs.get(loc.ayah);
                return ayah ? { surah: loc.surah, ayah: loc.ayah, text: ayah.text } : null;
            }).filter(result => result !== null);
        }
        case "get-verse-analysis": {
            const surahIndex = Number(args?.surah_index);
            const ayahIndex = Number(args?.ayah_index);
            if (isNaN(surahIndex) || isNaN(ayahIndex)) throw new McpError(ErrorCode.InvalidParams, "surah_index and ayah_index must be numbers.");
            const ayahKey = `${surahIndex}:${ayahIndex}`;
            const analysis = verseMorphology.get(ayahKey);
            if (!analysis) {
                const surah = quranData.get(surahIndex);
                const ayah = surah?.ayahs.get(ayahIndex);
                if (!ayah) throw new McpError(ErrorCode.InvalidRequest, `Ayah ${surahIndex}:${ayahIndex} not found.`);
                else throw new McpError(ErrorCode.InternalError, `Morphological analysis not found for Ayah ${ayahKey}, although the Ayah exists.`);
            }
            return analysis;
        }
        case searchExactPhraseToolDefinition.name: {
            const phraseQuery = String(args?.phrase_query).trim();
            if (!phraseQuery) throw new McpError(ErrorCode.InvalidParams, "phrase_query cannot be empty.");
            if (!ayahTextIndex) throw new McpError(ErrorCode.InternalError, "Ayah text index not initialized.");

            // Perform async search using FlexSearch
            // Use 'any' type for results to handle potential type mismatches
            // The result structure from enrich: true is [{ field: string, result: Array<{id: Id, doc: YourDocument}> }]
            const searchResults: any = await ayahTextIndex.searchAsync(phraseQuery, { enrich: true });

            // Check results structure more robustly
            if (!searchResults || !Array.isArray(searchResults) || searchResults.length === 0) {
                return []; // No field results
            }

            // Find the result set for the 'text' field
            const fieldResult = searchResults.find((r: any) => r.field === "text");
            if (!fieldResult || !Array.isArray(fieldResult.result) || fieldResult.result.length === 0) {
                return []; // No matches found in the 'text' field
            }

            // Extract the full documents
            const matchedItems: Array<{ id: string, doc: AyahDocument }> = fieldResult.result;

            // Map to the desired output format { surah, ayah, text }
            return matchedItems.map(item => ({
                surah: item.doc.sura,
                ayah: item.doc.ayah,
                text: item.doc.text
            }));
        }
        case firecrawlToolDefinition.name: {
             const query = String(args?.query);
             if (!query) throw new McpError(ErrorCode.InvalidParams, "query is required for firecrawl-research.");
             try {
                 console.error(`Starting Firecrawl research for query: ${query}`);
                 const result = await firecrawl.deepResearch(query, {
                     maxDepth: args?.maxDepth,
                     timeLimit: args?.timeLimit,
                     maxUrls: args?.maxUrls
                 });
                 console.error(`Firecrawl research completed.`);
                 return result;
             } catch (error: any) {
                 console.error(`Firecrawl research failed: ${error.message}`);
                 throw new McpError(ErrorCode.InternalError, `Firecrawl research failed: ${error.message}`);
             }
        }
        default:
            throw new McpError(ErrorCode.MethodNotFound, `Unknown tool: ${toolName}`);
    }
}

// --- MCP Tool Handler ---
mcpServer.setRequestHandler(CallToolRequestSchema, async (request): Promise<ReturnType<typeof CallToolResultSchema.parse>> => { // Correct return type
    try {
        const resultData = await executeMcpTool(request.params.name, request.params.arguments);
        let responseText: string;
        if (typeof resultData === 'string') {
            responseText = resultData;
        } else {
            responseText = JSON.stringify(resultData, null, 2);
        }
        return { content: [{ type: "text", text: responseText }] };
    } catch (error: any) {
         if (error instanceof McpError) {
             throw error;
         } else {
             console.error(`Unexpected error executing tool ${request.params.name}:`, error);
             throw new McpError(ErrorCode.InternalError, `Error executing tool ${request.params.name}: ${error.message}`);
         }
    }
});


// --- HTTP API Server Setup ---
const app = express();
app.use(cors());
app.use(express.json());

// Endpoint to execute MCP tools via HTTP
app.post('/api/tool/:toolName', async (req: Request, res: Response) => {
    const toolName = req.params.toolName;
    const args = req.body;
    console.log(`HTTP API: Received request for tool '${toolName}' with args:`, args);
    try {
        const result = await executeMcpTool(toolName, args);
        res.json({ success: true, data: result });
    } catch (error: any) {
        console.error(`HTTP API Error executing tool ${toolName}:`, error);
        const statusCode = (error instanceof McpError && error.code === ErrorCode.InvalidRequest) ? 400 : 500;
        res.status(statusCode).json({ success: false, error: error.message || 'Internal Server Error' });
    }
});

// Endpoint for Firecrawl research
app.post('/api/research', async (req: Request, res: Response) => {
    const { query, maxDepth, timeLimit, maxUrls } = req.body;
    console.log(`HTTP API: Received request for research with query: ${query}`);
    if (!query) {
        res.status(400).json({ success: false, error: 'Query parameter is required.' });
        return;
    }
    try {
        const result = await executeMcpTool(firecrawlToolDefinition.name, { query, maxDepth, timeLimit, maxUrls });
        res.json({ success: true, data: result });
        return;
    } catch (error: any) {
        console.error(`HTTP API Error during research:`, error);
        res.status(500).json({ success: false, error: error.message || 'Internal Server Error' });
        return;
    }
});


// --- Server Start ---
async function main() {
  try {
    // Load data first
    await loadQuranData();
    await loadMorphologyData();

    // Start MCP Server (stdio)
    const transport = new StdioServerTransport();
    await mcpServer.connect(transport);
    console.error(`${SERVER_NAME} v${SERVER_VERSION} MCP server running on stdio.`);

    // Start HTTP Server (for frontend)
    app.listen(HTTP_PORT, () => {
        console.error(`${SERVER_NAME} v${SERVER_VERSION} HTTP API server listening on port ${HTTP_PORT}.`);
    });

  } catch (error) {
    console.error("Server failed to start:", error);
    process.exit(1);
  }
}

main();
