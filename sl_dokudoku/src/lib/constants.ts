// Environment variables
export const MCP_API_KEY = process.env.MCP_API_KEY || '';
export const MCP_BASE_URL = process.env.MCP_BASE_URL || 'https://api.anthropic.com';

// File upload constants
export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB
export const ALLOWED_FILE_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "text/plain",
  "text/csv",
  "image/jpeg",
  "image/png",
] as const;

// Authentication
export const DEFAULT_LOGIN_REDIRECT = '/dashboard';

// Document processing
export const EXTRACTION_CONFIDENCE_THRESHOLD = 0.7; 