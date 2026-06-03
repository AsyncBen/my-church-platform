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
  private apiUrl = "https://api.scripture.api.bible/v1";
  private biblesUrl = "https://api.scripture.api.bible/v1/bibles";
  private kjvBibleId = "de4e12af7f28f599-02"; // KJV Bible ID from api.bible

  readonly versionIds: Record<string, string> = {
    kjv:  "de4e12af7f28f599-02",
    nkjv: "63097d2a0a2f7db3-01",
    amp:  "a81b73293d3080c9-01",
    nlt:  "d6e14a625393b4da-01",
    msg:  "6f11a7de016f942e-01",
    niv:  "78a9f6124f344018-01",
    neno: "611f8eb23aec8f13-01",
  };

  private bookIds: Record<string, string> = {
    'Genesis': 'GEN', 'Exodus': 'EXO', 'Leviticus': 'LEV', 'Numbers': 'NUM',
    'Deuteronomy': 'DEU', 'Joshua': 'JOS', 'Judges': 'JDG', 'Ruth': 'RUT',
    '1 Samuel': '1SA', '2 Samuel': '2SA', '1 Kings': '1KI', '2 Kings': '2KI',
    '1 Chronicles': '1CH', '2 Chronicles': '2CH', 'Ezra': 'EZR', 'Nehemiah': 'NEH',
    'Esther': 'EST', 'Job': 'JOB', 'Psalms': 'PSA', 'Proverbs': 'PRO',
    'Ecclesiastes': 'ECC', 'Isaiah': 'ISA', 'Jeremiah': 'JER',
    'Lamentations': 'LAM', 'Ezekiel': 'EZK', 'Daniel': 'DAN', 'Hosea': 'HOS',
    'Joel': 'JOL', 'Amos': 'AMO', 'Obadiah': 'OBA', 'Jonah': 'JON',
    'Micah': 'MIC', 'Nahum': 'NAM', 'Habakkuk': 'HAB', 'Zephaniah': 'ZEP',
    'Haggai': 'HAG', 'Zechariah': 'ZEC', 'Malachi': 'MAL', 'Matthew': 'MAT',
    'Mark': 'MRK', 'Luke': 'LUK', 'John': 'JHN', 'Acts': 'ACT', 'Romans': 'ROM',
    '1 Corinthians': '1CO', '2 Corinthians': '2CO', 'Galatians': 'GAL',
    'Ephesians': 'EPH', 'Philippians': 'PHP', 'Colossians': 'COL',
    '1 Thessalonians': '1TH', '2 Thessalonians': '2TH', '1 Timothy': '1TI',
    '2 Timothy': '2TI', 'Titus': 'TIT', 'Philemon': 'PHM', 'Hebrews': 'HEB',
    'James': 'JAS', '1 Peter': '1PE', '2 Peter': '2PE', '1 John': '1JN',
    '2 John': '2JN', '3 John': '3JN', 'Jude': 'JUD', 'Revelation': 'REV',
  };

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
   * Convert "John 3" or "John 3:16" to api.bible format "JHN.3" or "JHN.3.16"
   */
  private toPassageId(reference: string): string | null {
    const trimmed = reference.trim();

    // Match "Book Chapter" e.g. "John 3"
    const chapterMatch = trimmed.match(/^(.+?)\s+(\d+)$/);
    // Match "Book Chapter:Verse" e.g. "John 3:16"
    const verseMatch = trimmed.match(/^(.+?)\s+(\d+):(\d+)(?:-(\d+))?$/);

    if (verseMatch) {
      const [, book, chapter, verse, endVerse] = verseMatch;
      const bookId = this.bookIds[book];
      if (!bookId) return null;
      return endVerse
        ? `${bookId}.${chapter}.${verse}-${bookId}.${chapter}.${endVerse}`
        : `${bookId}.${chapter}.${verse}`;
    }

    if (chapterMatch) {
      const [, book, chapter] = chapterMatch;
      const bookId = this.bookIds[book];
      if (!bookId) return null;
      return `${bookId}.${chapter}`;
    }

    return null;
  }

  /**
   * Search for a specific scripture by reference
   */
  async getScripture(reference: string, bibleId?: string): Promise<ApiBibleVerse | null> {
    if (!this.apiKey) {
      return null;
    }

    const targetBible = bibleId || this.kjvBibleId;
    const passageId = this.toPassageId(reference);
    
    if (!passageId) {
      return null;
    }

    const url = `${this.biblesUrl}/${targetBible}/passages/${passageId}`;
    const params = {
      "content-type": "text",
      "include-verse-numbers": true,
    };

    const cacheKey = `${targetBible}:${passageId}`;
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey) || null;
    }

    try {
      const response = await axios.get(url, {
        headers: this.headers,
        params: params,
      });

      const verse: ApiBibleVerse = {
        reference: response.data.data.reference,
        text: (response.data.data.content ?? "").replace(/<[^>]+>/g, "").trim(),
        content: response.data.data.content,
        verseCount: response.data.data.verseCount,
      };

      this.cache.set(cacheKey, verse);
      return verse;
    } catch (error) {
      if (axios.isAxiosError(error)) {
      } else {
      }
      return null;
    }
  }

  /**
   * Search for verses containing keywords
   */
  async searchScriptures(query: string, limit: number = 20): Promise<ApiBibleSearchResult | null> {
    if (!this.apiKey) {
      return null;
    }

    try {
      const response = await axios.get(
        `${this.biblesUrl}/${this.kjvBibleId}/search`,
        {
          headers: this.headers,
          params: {
            query: query,
            limit: limit,
            sort: "relevance",
          },
        }
      );

      const rawPassages = response.data?.data?.passages ?? [];

      return {
        query: response.data?.data?.query ?? query,
        passages: rawPassages.map((p: any) => ({
          reference: p.reference ?? p.id,
          text: (p.content ?? "").replace(/<[^>]+>/g, "").trim(),
        })),
      };
    } catch (error) {
      if (axios.isAxiosError(error)) {
      }
      return null;
    }
  }

  /**
   * Get a list of available Bibles
   */
  async getAvailableBibles(): Promise<any> {
    if (!this.apiKey) {
      return null;
    }

    try {
      const response = await axios.get(`${this.biblesUrl}`, {
        headers: this.headers,
        params: { limit: 100 },
      });
      return response.data.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
      } 
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