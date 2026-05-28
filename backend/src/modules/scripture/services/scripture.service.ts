import { localBibleService } from "./local-bible.service";
import { apiBibleService } from "./api-bible.service";

export interface ScriptureResult {
  reference: string;
  text: string;
  book?: string;
  chapter?: number;
  verse?: number;
  source: "local" | "api-bible";
}

class ScriptureService {
  /**
   * Detect if a query looks like a scripture reference
   * Matches: "John 3:16", "Gen 1 1", "Exodus 1:3", "Romans 8:28-30"
   */
  private looksLikeReference(query: string): boolean {
    return /^[\w\s]+\s+\d+[\s:]\d+/.test(query.trim());
  }

  /**
   * Get a scripture by reference, trying local first, then api.bible
   */
  async getScripture(
    reference: string,
    preferredSource: "local" | "api-bible" | "any" = "any"
  ): Promise<ScriptureResult[]> {
    // Try local first if not preferring api-bible
    if (preferredSource !== "api-bible") {
      const localResult = localBibleService.getScripture(reference);
      if (localResult && localResult.length > 0) {
        return localResult.map((v) => ({
          reference: v.reference,
          text: v.text,
          book: v.book,
          chapter: v.chapter,
          verse: v.verse,
          source: "local",
        }));
      }
    }

    // Fall back to api.bible
    if (preferredSource !== "local") {
      try {
        const result = await apiBibleService.getScripture(reference);
        if (result) {
          return [
            {
              reference: result.reference,
              text: result.text,
              source: "api-bible",
            },
          ];
        }
      } catch (error) {
        console.error("[Scripture] api.bible lookup failed:", error);
      }
    }

    return [];
  }

  /**
   * Search for scriptures, trying local first, then api.bible
   */
  async searchScriptures(
    query: string,
    preferredSource: "local" | "api-bible" | "any" = "any",
    limit: number = 20
  ): Promise<ScriptureResult[]> {
    console.log(`[DEBUG] searchScriptures called: query="${query}", source="${preferredSource}"`);

    // ── Reference detection ───────────────────────────────────────────────
    // If query looks like "Genesis 1:2" or "Gen 1 2", use getScripture instead
    if (this.looksLikeReference(query)) {
      console.log(`[Scripture] Query looks like a reference, routing to getScripture`);

      // Normalize "Genesis 1 2" → "Genesis 1:2"
      const normalized = query.trim().replace(
        /^([\w\s]+?)\s+(\d+)\s+(\d+)$/,
        '$1 $2:$3'
      );

      const refResults = await this.getScripture(normalized, preferredSource);
      if (refResults.length > 0) return refResults;

      // If reference lookup fails, fall through to keyword search
      console.log(`[Scripture] Reference lookup failed, falling back to keyword search`);
    }
    // ─────────────────────────────────────────────────────────────────────

    // LOCAL path
    if (preferredSource === "local" || preferredSource === "any") {
      const localResults = localBibleService.searchScriptures(query, limit);
      console.log(`[Scripture] Local results count: ${localResults.length}`);

      if (preferredSource === "local") {
        // Explicit local request — return whatever we have (even empty)
        return localResults.map((v) => ({
          reference: v.reference,
          text: v.text,
          book: v.book,
          chapter: v.chapter,
          verse: v.verse,
          source: "local" as const,
        }));
      }

      // "any" mode: only use local if it actually found results
      if (localResults.length > 0) {
        return localResults.map((v) => ({
          reference: v.reference,
          text: v.text,
          book: v.book,
          chapter: v.chapter,
          verse: v.verse,
          source: "local" as const,
        }));
      }
    }

    // API BIBLE path
    if (preferredSource === "api-bible" || preferredSource === "any") {
      console.log("[Scripture] Trying api.bible...");
      try {
        const result = await apiBibleService.searchScriptures(query, limit);
        if (result && result.passages.length > 0) {
          return result.passages.slice(0, limit).map((p) => ({
            reference: p.reference,
            text: p.text,
            source: "api-bible" as const,
          }));
        }
      } catch (error) {
        console.error("[Scripture] api.bible search failed:", error);
      }

      // api-bible was explicitly chosen but failed — fall back to local gracefully
      if (preferredSource === "api-bible") {
        const fallback = localBibleService.searchScriptures(query, limit);
        return fallback.map((v) => ({
          reference: v.reference,
          text: v.text,
          book: v.book,
          chapter: v.chapter,
          verse: v.verse,
          source: "local" as const,
        }));
      }
    }

    console.log("[Scripture] No results found, returning empty array");
    return [];
  }

  /**
   * Get list of all books in the local Bible
   */
  getBooks(): { name: string; abbrev: string; chapters: number }[] {
    return localBibleService.getBooks();
  }

  /**
   * Initialize the scripture service
   */
  async initialize(): Promise<void> {
    try {
      await localBibleService.initialize();
    } catch (error) {
      console.error("[Scripture] Failed to initialize service:", error);
      throw error;
    }
  }
}

export const scriptureService = new ScriptureService();
