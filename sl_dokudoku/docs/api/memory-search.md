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