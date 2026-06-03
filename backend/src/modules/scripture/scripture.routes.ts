import { Router, Request, Response } from "express";
import { scriptureService } from "./services/scripture.service";
import { apiBibleService } from "./services/api-bible.service";
import { validate, scriptureSearchSchema, scriptureReferenceSchema } from "./validators/scripture.validators";

const router = Router();

/**
 * Search for scriptures
 * GET /scripture/search?query=love&version=kjv
 */
router.get("/search", async (req: Request, res: Response) => {
  try {
    const { query, version } = validate(scriptureSearchSchema, req.query);

    // KJV uses local, everything else uses api-bible
    const source = version === "kjv" ? "local" : "api-bible";
    const results = await scriptureService.searchScriptures(query, source, 20);

    return res.json({
      success: true,
      query,
      version,
      count: results.length,
      results,
    });
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Search failed";
    return res.status(400).json({ success: false, error: msg });
  }
});

/**
 * Get a specific scripture by reference
 * GET /scripture/get?reference=John+3:16&version=kjv
 */
router.get("/get", async (req: Request, res: Response) => {
  try {
    const { reference, version } = validate(scriptureReferenceSchema, req.query);

    let results: any[] = [];

    if (version === "kjv") {
      // Local for KJV — fast, no API quota
      results = await scriptureService.getScripture(reference, "local");
    } else {
      const bibleId = apiBibleService.versionIds[version];
      if (!bibleId) {
        return res.status(400).json({ success: false, error: `Unknown version: ${version}` });
      }

      const result = await apiBibleService.getScripture(reference, bibleId);
      if (result) {
        // Parse "Book Chapter" from reference
        const refMatch = reference.match(/^(.+?)\s+(\d+)$/);
        const book = refMatch?.[1] ?? reference;
        const chapter = parseInt(refMatch?.[2] ?? "1", 10);

        // Try to parse HTML format first (api.bible returns HTML by default)
        const verseMatches = result.content.match(/<span[^>]*data-number="(\d+)"[^>]*class="v"[^>]*>\d+<\/span>\s*([^<]*)/g);
        
        if (verseMatches && verseMatches.length > 0) {
          results = verseMatches.map(match => {
            const numMatch = match.match(/data-number="(\d+)"/);
            const textMatch = match.match(/<\/span>\s*(.*)/);
            const verseNum = numMatch ? parseInt(numMatch[1], 10) : 0;
            const verseText = textMatch ? textMatch[1].trim() : "";
            
            return {
              reference: `${book} ${chapter}:${verseNum}`,
              text: verseText,
              book,
              chapter,
              verse: verseNum,
              source: "api-bible" as const,
            };
          }).filter(v => v.verse > 0 && v.text.length > 0);
        }
        
        // If HTML parsing didn't work, try the text format (with [1] [2] markers)
        if (results.length === 0) {
          const verseLines = result.text
            .split(/\[(\d+)\]/)
            .reduce<{ num: string; text: string }[]>((acc, part, i, arr) => {
              if (/^\d+$/.test(part) && arr[i + 1]) {
                acc.push({ num: part, text: arr[i + 1].trim() });
              }
              return acc;
            }, []);

          if (verseLines.length > 0) {
            results = verseLines.map(({ num, text }) => ({
              reference: `${book} ${chapter}:${num}`,
              text,
              book,
              chapter,
              verse: parseInt(num, 10),
              source: "api-bible" as const,
            }));
          }
        }
        
        // Final fallback: return as single result if no verses parsed
        if (results.length === 0) {
          results = [{
            reference: result.reference,
            text: result.text,
            source: "api-bible" as const,
          }];
        }
      }
    }

    if (results.length === 0) {
      return res.status(404).json({
        success: false,
        error: "Scripture not found",
      });
    }

    return res.json({
      success: true,
      reference,
      version,
      results,
    });
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Lookup failed";
    return res.status(400).json({ success: false, error: msg });
  }
});

/**
 * Get all Bible books
 * GET /scripture/books
 */
router.get("/books", (req: Request, res: Response) => {
  try {
    const books = scriptureService.getBooks();
    return res.json({
      success: true,
      count: books.length,
      books,
    });
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Failed to fetch books";
    return res.status(500).json({ success: false, error: msg });
  }
});

/**
 * Get available Bible versions
 * GET /scripture/versions
 */
router.get("/versions", (_req: Request, res: Response) => {
  const versions = [
    { id: "de4e12af7f28f599-02", abbreviation: "KJV",  name: "King James Version",         source: "local" },
    { id: "63097d2a0a2f7db3-01", abbreviation: "NKJV", name: "New King James Version",      source: "api-bible" },
    { id: "a81b73293d3080c9-01", abbreviation: "AMP",  name: "Amplified Bible",             source: "api-bible" },
    { id: "d6e14a625393b4da-01", abbreviation: "NLT",  name: "New Living Translation",      source: "api-bible" },
    { id: "6f11a7de016f942e-01", abbreviation: "MSG",  name: "The Message",                 source: "api-bible" },
    { id: "78a9f6124f344018-01", abbreviation: "NIV",  name: "New International Version",   source: "api-bible" },
    { id: "611f8eb23aec8f13-01", abbreviation: "NENO", name: "Neno Bibilia Takatifu",       source: "api-bible" },
  ];

  return res.json({ success: true, count: versions.length, versions });
});

export default router;