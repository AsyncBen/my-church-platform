import axios from "axios";
import { API_BIBLE_KEY } from "../../../config/env";

interface ApiBibleVerse {
  reference: string;
  text: string;
  content: string;
  verseCount: number;
}

interface ApiBibleSearchResult {
  query: string;
  passages: Array<{
    reference: string;
    text: string;
  }>;
}

class ApiBibleService {
  private apiKey: string;
  private apiUrl = "https://api.api.bible/v1";
  private biblesUrl = "https://api.api.bible/v1/bibles";
  private kjvBibleId = "de4e12af7f28f599-02"; // KJV Bible ID from api.bible
  private cache: Map<string, ApiBibleVerse> = new Map();

  constructor() {
    this.apiKey = API_BIBLE_KEY;
  }

  private get headers() {
    return {
      "api-key": this.apiKey,
    };
  }

  /**
   * Search for a specific scripture by reference
   */
  async getScripture(reference: string): Promise<ApiBibleVerse | null> {
    if (!this.apiKey) {
      console.warn("[ApiBible] API key not configured");
      return null;
    }

    // Check cache first
    const cacheKey = `${this.kjvBibleId}:${reference}`;
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey) || null;
    }

    try {
      const response = await axios.get(
        `${this.biblesUrl}/${this.kjvBibleId}/passages/${encodeURIComponent(reference)}`,
        {
          headers: this.headers,
          params: {
            "content-type": "text",
            "include-passage-references": true,
            "include-verse-numbers": true,
          },
        }
      );

      const verse: ApiBibleVerse = {
        reference: response.data.reference,
        text: response.data.content || response.data.text,
        content: response.data.content,
        verseCount: response.data.verseCount,
      };

      // Cache the result
      this.cache.set(cacheKey, verse);
      return verse;
    } catch (error) {
      console.error(
        "[ApiBible] Failed to fetch scripture:",
        error instanceof Error ? error.message : error
      );
      return null;
    }
  }

  /**
   * Search for verses containing keywords
   */
  async searchScriptures(query: string, limit: number = 20): Promise<ApiBibleSearchResult | null> {
    if (!this.apiKey) {
      console.warn("[ApiBible] API key not configured");
      return null;
    }

    try {
      const response = await axios.get(
        `${this.biblesUrl}/${this.kjvBibleId}/search`,
        {
          headers: this.headers,
          params: {
            query: query,
            limit: limit,         // ← honour the limit
            sort: "relevance",    // ← get best matches first
          },
        }
      );

      // API Bible nests results under .data.data.passages
      // Each passage is { id, orgId, bibleId, bookId, reference, content, ... }
      const rawPassages = response.data?.data?.passages ?? [];

      return {
        query: response.data?.data?.query ?? query,
        passages: rawPassages.map((p: any) => ({
          reference: p.reference ?? p.id,
          // content contains HTML/markup — strip tags for plain text
          text: (p.content ?? "").replace(/<[^>]+>/g, "").trim(),
        })),
      };
    } catch (error) {
      console.error(
        "[ApiBible] Search failed:",
        error instanceof Error ? error.message : error
      );
      return null;
    }
  }

  /**
   * Get a list of available Bibles
   */
  async getAvailableBibles(): Promise<any> {
    if (!this.apiKey) return null;

    try {
      const response = await axios.get(`${this.biblesUrl}`, {
        headers: this.headers,
        params: { limit: 100 },
      });
      return response.data.data;
    } catch (error) {
      console.error(
        "[ApiBible] Failed to fetch Bibles:",
        error instanceof Error ? error.message : error
      );
      return null;
    }
  }

  /**
   * Clear the cache
   */
  clearCache(): void {
    this.cache.clear();
  }
}

export const apiBibleService = new ApiBibleService();
