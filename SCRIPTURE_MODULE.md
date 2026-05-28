# Scripture/Bible Module Documentation

## Overview

The Scripture module provides Bible verse lookup and search functionality to the church platform. It supports both local offline search (KJV Bible JSON) and cloud-based API Bible as a fallback.

## Features

✅ **Local Offline Search** - KJV Bible bundled as JSON (4.4MB)  
✅ **API Bible Integration** - Fallback to cloud API for extended functionality  
✅ **Fast Scripture Lookup** - Get specific verses by reference (e.g., "John 3:16")  
✅ **Keyword Search** - Find verses containing specific keywords  
✅ **Bible Books Listing** - Get list of all 66 books with chapter counts  

## Backend Architecture

### Module Structure
```
backend/src/modules/scripture/
├── services/
│   ├── local-bible.service.ts    # KJV JSON parsing and search
│   ├── api-bible.service.ts      # API Bible integration
│   └── scripture.service.ts      # Unified service layer
├── validators/
│   └── scripture.validators.ts   # Request validation (Zod)
└── scripture.routes.ts           # API endpoints
```

### Data Files
- `backend/kjv.json` (4.4MB) - Complete King James Version Bible

## API Endpoints

### 1. Search for Scriptures
```
GET /scripture/search?query=love&version=kjv
```

**Query Parameters:**
- `query` (required): Search keyword or phrase
- `version` (optional): `kjv` (default) or `api-bible`

**Response:**
```json
{
  "success": true,
  "query": "love",
  "version": "kjv",
  "count": 20,
  "results": [
    {
      "reference": "1 John 4:8",
      "text": "He that loveth not knoweth not God; for God is love.",
      "book": "1 John",
      "chapter": 4,
      "verse": 8,
      "source": "local"
    }
  ]
}
```

### 2. Get Specific Scripture
```
GET /scripture/get?reference=John+3:16&version=kjv
```

**Query Parameters:**
- `reference` (required): Scripture reference (e.g., "John 3:16", "Romans 8:28", "Psalm 23:1-6")
- `version` (optional): `kjv` (default) or `api-bible`

**Response:**
```json
{
  "success": true,
  "reference": "John 3:16",
  "version": "kjv",
  "results": [
    {
      "reference": "John 3:16",
      "text": "For God so loved the world, that he gave his only begotten Son, that whosoever believeth in him should not perish, but have everlasting life.",
      "book": "John",
      "chapter": 3,
      "verse": 16,
      "source": "local"
    }
  ]
}
```

### 3. Get All Bible Books
```
GET /scripture/books
```

**Response:**
```json
{
  "success": true,
  "count": 66,
  "books": [
    {
      "name": "Genesis",
      "abbrev": "gn",
      "chapters": 50
    },
    {
      "name": "Exodus",
      "abbrev": "ex",
      "chapters": 40
    }
  ]
}
```

## Reference Format

The scripture lookup supports multiple reference formats:

| Format | Example | Result |
|--------|---------|--------|
| Single verse | `John 3:16` | John 3:16 only |
| Verse range | `John 3:16-18` | John 3:16, 3:17, 3:18 |
| Chapter range | `John 3:16-4:5` | John 3:16 through 4:5 |
| Abbreviated | `Jn 3:16` | John 3:16 (when unambiguous) |

## Frontend Integration

### Service Usage (React)

```typescript
import { scriptureService } from '@/services/scripture.service'

// Search
const results = await scriptureService.search('love', 'kjv')

// Get specific verse
const verses = await scriptureService.getByReference('John 3:16', 'kjv')

// Get all books
const books = await scriptureService.getBooks()
```

### Components

- **ScriptureSearch.tsx** - Search interface with keyword/reference input
- **ScripturePreview.tsx** - Display selected scripture with broadcast button
- **RecentScriptures.tsx** - Load and display favorite scriptures
- **ScriptureCard.tsx** - Scripture card for queue/list display

## Configuration

### Environment Variables

Add to `backend/.env`:
```
API_BIBLE_KEY=ua-wu0vWIw7j3uFU6LH23
```

This key enables the fallback API Bible service when the local search doesn't find results.

## Performance

- **Local KJV**: < 5ms for most queries (in-memory JSON)
- **API Bible**: 500ms - 2s depending on network (cached)

## Fallback Logic

The service tries in this order:

1. **Try Local** (KJV JSON) - Fast, always available
2. **Try API Bible** - If specified or local has no results
3. **Return empty** - If both fail

When version is set to "any", local is preferred. Set to "api-bible" to skip local search.

## Future Enhancements

- [ ] Support for ASV (American Standard Version)
- [ ] Support for NRSV (requires different licensing)
- [ ] Verse caching in database
- [ ] User favorites/bookmarks
- [ ] Verse sharing with commentary
- [ ] Multiple language support
- [ ] Verse audio playback

## Testing

Test the endpoints using curl:

```bash
# Search for keyword
curl "http://localhost:4000/scripture/search?query=love"

# Get specific verse
curl "http://localhost:4000/scripture/get?reference=John%203:16"

# Get books list
curl "http://localhost:4000/scripture/books"
```

## Troubleshooting

**API returns empty results:**
- Verify the verse reference format is correct
- Try searching by keyword instead
- Check if API_BIBLE_KEY is set for api-bible fallback

**Bible JSON not loading:**
- Ensure `kjv.json` exists in backend root
- Check file is valid JSON: `node -c kjv.json`

**API Bible timeout:**
- Network issue - check internet connection
- API quota exceeded - check api.bible dashboard
