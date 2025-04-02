# MemorySearch Component

## Overview
The `MemorySearch` component allows users to search through stored memory data using the Mem0 API integration. It provides a search interface with relevance scoring and filtering capabilities.

## Props
| Name | Type | Default | Description |
|------|------|---------|-------------|
| `initialQuery` | `string` | `''` | Initial search query (optional) |
| `threshold` | `number` | `0.7` | Minimum relevance score threshold |
| `onSearch` | `(query: string) => void` | - | Callback when search is triggered |
| `onError` | `(error: Error) => void` | - | Callback when an error occurs |

## Usage

```tsx
import { MemorySearch } from '@/components/memory/MemorySearch';

function MyPage() {
  const handleSearch = (query: string) => {
    console.log('Searching for:', query);
  };

  const handleError = (error: Error) => {
    console.error('Search error:', error);
  };

  return (
    <MemorySearch
      initialQuery="initial search"
      threshold={0.8}
      onSearch={handleSearch}
      onError={handleError}
    />
  );
}
```

## Examples

### Basic Search
```tsx
<MemorySearch onSearch={(query) => console.log(query)} />
```

### With Custom Threshold
```tsx
<MemorySearch threshold={0.9} onSearch={(query) => console.log(query)} />
```

### With Error Handling
```tsx
<MemorySearch 
  onSearch={(query) => console.log(query)}
  onError={(error) => console.error(error)}
/>
```

## Tips
- Use a higher threshold (e.g., 0.8 or 0.9) for more precise results
- Use a lower threshold (e.g., 0.5 or 0.6) for more comprehensive results
- The component includes loading states and error handling out of the box

## Internal Implementation Details
The component uses React Query for data fetching and state management, with the following hooks:
- `useMutation` for search API calls
- `useState` for local state management
- `useEffect` for initializing the search query

The component also implements proper error handling and loading states.

#### **Create User Guides**
```markdown:docs/guides/memory-search.md
# Memory Search Guide

## Introduction
This guide explains how to use the memory search feature.

## Steps
1. Enter your query in the search bar.
2. Click the search button.
3. View the results in the list below.

## Tips
- Use specific keywords for better results.
- Check the "Advanced Filters" for more options.
```

#### **Add API Examples**
```markdown:docs/api/memory-search.md
# Memory Search API

## Endpoint
`POST /api/memory/search`

## Request
```json
{
  "query": "test",
  "options": {
    "threshold": 0.7
  }
}
```

## Response
```json
[
  {
    "text": "test result",
    "score": 0.8
  }
]
```

## Example
```bash
curl -X POST /api/memory/search \
  -H "Content-Type: application/json" \
  -d '{"query": "test"}'
```
```

---

### 3. **Optimize Database Queries**

#### **Add Indexes for Common Queries**
```sql
-- Add index for memory search
CREATE INDEX idx_memory_search ON memory USING gin (to_tsvector('english', text));

-- Add index for document chunks
CREATE INDEX idx_document_chunks ON document_chunks (document_id, chunk_index);
```

#### **Implement Query Batching**
```typescript:src/modules/memory/mem0-service.ts
async function batchSearch(queries: string[]): Promise<any[]> {
  const batchSize = 10;
  const results: any[] = [];

  for (let i = 0; i < queries.length; i += batchSize) {
    const batch = queries.slice(i, i + batchSize);
    const batchResults = await Promise.all(
      batch.map(query => mem0.search(query))
    );
    results.push(...batchResults);
  }

  return results;
}
```

#### **Add Connection Pooling**
```typescript:src/lib/db.ts
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 20, // Maximum number of connections
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

export const query = (text: string, params?: any) => pool.query(text, params);
```

---

### Next Steps

1. **Run E2E Tests**
   - Execute Cypress tests in CI/CD pipeline
   - Monitor test coverage
   - Fix failing tests

2. **Review Documentation**
   - Ensure all components are documented
   - Verify user guides are clear
   - Test API examples

3. **Monitor Database Performance**
   - Use `EXPLAIN ANALYZE` to verify query performance
   - Monitor connection pool usage
   - Optimize further based on usage patterns

Would you like me to elaborate on any specific part? 