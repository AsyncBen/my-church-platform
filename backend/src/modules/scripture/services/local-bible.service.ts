import fs from "fs";
import path from "path";

interface BibleBook {
  abbrev: string;
  name: string;
  chapters: string[][];
}

interface ScriptureVerse {
  book: string;
  chapter: number;
  verse: number;
  text: string;
  reference: string;
}

class LocalBibleService {
  private bibleData: BibleBook[] = [];
  private bookMap: Map<string, BibleBook> = new Map();
  private loaded = false;

  async initialize(): Promise<void> {
    if (this.loaded) return;
    
    try {
      const biblePath = path.join(__dirname, "../../../..", "kjv.json");
      
      // Verify file exists
      if (!fs.existsSync(biblePath)) {
        throw new Error(`Bible data file not found at: ${biblePath}`);
      }
      
      // Read file with encoding
      let data = fs.readFileSync(biblePath, "utf-8");
      
      // Strip BOM (Byte Order Mark) if present
      // This handles the invisible character that some editors add to UTF-8 files
      if (data.charCodeAt(0) === 0xFEFF) {
        data = data.slice(1);
        console.log("[Scripture] BOM detected and removed from Bible data");
      }
      
      // Remove any other potential leading whitespace or invisible characters
      data = data.trimStart();
      
      // Validate that data starts with expected JSON array character
      if (!data.startsWith('[')) {
        throw new Error(`Bible data appears to be invalid format. Starts with: ${data.substring(0, 50)}`);
      }
      
      // Parse JSON
      this.bibleData = JSON.parse(data);
      
      // Validate parsed data structure
      if (!Array.isArray(this.bibleData)) {
        throw new Error("Bible data is not an array");
      }
      
      if (this.bibleData.length === 0) {
        throw new Error("Bible data array is empty");
      }
      
      // Create a map for quick book lookup (case-insensitive)
      this.bibleData.forEach((book, index) => {
        // Validate book structure
        if (!book.name || !book.abbrev || !Array.isArray(book.chapters)) {
          console.warn(`[Scripture] Book at index ${index} has invalid structure, skipping`);
          return;
        }
        
        this.bookMap.set(book.name.toLowerCase(), book);
        this.bookMap.set(book.abbrev.toLowerCase(), book);
      });
      
      this.loaded = true;
      console.log(`[Scripture] Bible data loaded successfully: ${this.bibleData.length} books`);
    } catch (error) {
      if (error instanceof SyntaxError) {
        console.error("[Scripture] Invalid JSON format in Bible data file");
      }
      console.error("[Scripture] Failed to load Bible data:", error);
      throw error;
    }
  }

  /**
   * Check if the service is initialized and ready
   */
  isLoaded(): boolean {
    return this.loaded;
  }

  /**
   * Parse a scripture reference like "Romans 8:28" or "John 3:16-18" or "Romans 8:28-30"
   * Supports formats:
   * - "Book Chapter:Verse" (e.g., "John 3:16")
   * - "Book Chapter:Verse-Verse" (e.g., "Romans 8:28-30")
   * - "Book Chapter:Verse-Chapter:Verse" (e.g., "Romans 8:28-9:5")
   * - "Book Chapter Verse" (e.g., "Genesis 1 2" → normalizes to "Genesis 1:2")
   */
  private parseReference(reference: string): {
    bookName: string;
    chapters: number[];
    verses: { [key: number]: number[] };
  } | null {
    const trimmed = reference.trim();

    // Normalize "Genesis 1 2" or "Genesis 1 3" → "Genesis 1:2"
    // Handles: "Book Ch Vs", "Book Ch:Vs", "Book Ch:Vs-Vs"
    const normalized = trimmed
      .replace(/^([\w\s]+?)\s+(\d+)\s+(\d+)$/, '$1 $2:$3') // "Genesis 1 2" → "Genesis 1:2"
      .replace(/^([\w\s]+?)\s+(\d+):(\d+)-(\d+)$/, '$1 $2:$3-$4') // already handled
      .trim();

    const match = normalized.match(
      /^([\w\s]+?)\s+(\d+):(\d+)(?:-(?:(\d+):)?(\d+))?$/
    );

    if (!match) return null;

    const [, bookName, chapter, verse, endChapter, endVerse] = match;
    const startChapter = parseInt(chapter, 10);
    const startVerse = parseInt(verse, 10);
    const endChapterNum = endChapter ? parseInt(endChapter, 10) : startChapter;
    const endVerseNum = endVerse ? parseInt(endVerse, 10) : startVerse;

    if (startChapter < 1 || startVerse < 1 || endChapterNum < startChapter) {
      return null;
    }

    const chapters: number[] = [];
    const verses: { [key: number]: number[] } = {};

    for (let c = startChapter; c <= endChapterNum; c++) {
      chapters.push(c);
      const vStart = c === startChapter ? startVerse : 1;
      const vEnd = c === endChapterNum ? endVerseNum : 999;
      if (!verses[c]) verses[c] = [];
      for (let v = vStart; v <= vEnd; v++) {
        verses[c].push(v);
      }
    }

    return { bookName: bookName.trim(), chapters, verses };
  }

  /**
   * Find a book by name, trying multiple matching strategies
   */
  private findBook(bookName: string): BibleBook | null {
    const normalizedName = bookName.toLowerCase();
    
    // Direct match
    if (this.bookMap.has(normalizedName)) {
      return this.bookMap.get(normalizedName)!;
    }
    
    // Prefix match (e.g., "Rom" matches "Romans")
    for (const [key, book] of this.bookMap) {
      if (book.name.toLowerCase().startsWith(normalizedName) ||
          book.abbrev.toLowerCase().startsWith(normalizedName)) {
        return book;
      }
    }
    
    return null;
  }

  /**
   * Get a specific scripture passage by reference
   */
  getScripture(reference: string): ScriptureVerse[] | null {
    if (!this.loaded) {
      console.warn("[Scripture] Service not loaded, cannot get scripture");
      return null;
    }

    const parsed = this.parseReference(reference);
    if (!parsed) {
      console.warn(`[Scripture] Invalid reference format: "${reference}"`);
      return null;
    }

    const book = this.findBook(parsed.bookName);
    if (!book) {
      console.warn(`[Scripture] Book not found: "${parsed.bookName}"`);
      return null;
    }

    const results: ScriptureVerse[] = [];

    parsed.chapters.forEach((chapterNum) => {
      const chapterIdx = chapterNum - 1;
      
      // Check if chapter exists
      if (!book.chapters[chapterIdx]) {
        console.warn(`[Scripture] Chapter ${chapterNum} not found in ${book.name}`);
        return;
      }
      
      const verses = parsed.verses[chapterNum] || [];
      verses.forEach((verseNum) => {
        const verseIdx = verseNum - 1;
        const text = book.chapters[chapterIdx][verseIdx];
        
        if (text) {
          results.push({
            book: book.name,
            chapter: chapterNum,
            verse: verseNum,
            text: text.replace(/[{}]/g, ""), // Clean up formatting markers
            reference: `${book.name} ${chapterNum}:${verseNum}`,
          });
        } else {
          console.warn(`[Scripture] Verse ${verseNum} not found in ${book.name} chapter ${chapterNum}`);
        }
      });
    });

    return results.length > 0 ? results : null;
  }

  /**
   * Get multiple scripture passages
   */
  getMultipleScriptures(references: string[]): { reference: string; verses: ScriptureVerse[] | null }[] {
    return references.map(ref => ({
      reference: ref,
      verses: this.getScripture(ref),
    }));
  }

  /**
   * Search for verses containing specific keywords
   */
  searchScriptures(query: string, limit: number = 20): ScriptureVerse[] {
    if (!this.loaded) {
      console.warn("[Scripture] Service not loaded, cannot search");
      return [];
    }

    const normalizedQuery = query.toLowerCase().trim();
    const keywords = normalizedQuery.split(/\s+/).filter((k) => k.length > 2);
    if (keywords.length === 0) return [];

    // ── Book-name search ──────────────────────────────────────────────────
    // If the query matches a book name/abbreviation, return its first chapter
    const matchedBook = this.findBook(normalizedQuery);
    if (matchedBook) {
      const results: ScriptureVerse[] = [];
      const firstChapter = matchedBook.chapters[0] ?? [];
      for (let verseIdx = 0; verseIdx < firstChapter.length && results.length < limit; verseIdx++) {
        const text = firstChapter[verseIdx];
        if (text) {
          results.push({
            book: matchedBook.name,
            chapter: 1,
            verse: verseIdx + 1,
            text: text.replace(/[{}]/g, ""),
            reference: `${matchedBook.name} 1:${verseIdx + 1}`,
          });
        }
      }
      return results;
    }
    // ─────────────────────────────────────────────────────────────────────

    // Full-text keyword search (existing logic)
    const results: ScriptureVerse[] = [];

    outer: for (const book of this.bibleData) {
      for (let chapterIdx = 0; chapterIdx < book.chapters.length; chapterIdx++) {
        const chapter = book.chapters[chapterIdx];
        for (let verseIdx = 0; verseIdx < chapter.length; verseIdx++) {
          const verse = chapter[verseIdx];
          const text = verse.toLowerCase();
          const matches = keywords.filter((kw) => text.includes(kw));

          if (matches.length > 0) {
            results.push({
              book: book.name,
              chapter: chapterIdx + 1,
              verse: verseIdx + 1,
              text: verse.replace(/[{}]/g, ""),
              reference: `${book.name} ${chapterIdx + 1}:${verseIdx + 1}`,
            });

            if (results.length >= limit) break outer;
          }
        }
      }
    }

    return results;
  }

  /**
   * Get a list of all Bible books with metadata
   */
  getBooks(): { name: string; abbrev: string; chapters: number }[] {
    if (!this.loaded) return [];
    
    return this.bibleData.map((book) => ({
      name: book.name,
      abbrev: book.abbrev,
      chapters: book.chapters.length,
    }));
  }

  /**
   * Get a specific book by name or abbreviation
   */
  getBook(bookName: string): { name: string; abbrev: string; chapters: number } | null {
    if (!this.loaded) return null;
    
    const book = this.findBook(bookName);
    if (!book) return null;
    
    return {
      name: book.name,
      abbrev: book.abbrev,
      chapters: book.chapters.length,
    };
  }

  /**
   * Get total number of verses in a chapter
   */
  getChapterVerseCount(bookName: string, chapter: number): number | null {
    if (!this.loaded) return null;
    
    const book = this.findBook(bookName);
    if (!book) return null;
    
    const chapterIdx = chapter - 1;
    if (!book.chapters[chapterIdx]) return null;
    
    return book.chapters[chapterIdx].length;
  }

  /**
   * Reset the service (useful for testing)
   */
  reset(): void {
    this.bibleData = [];
    this.bookMap.clear();
    this.loaded = false;
  }
}

export const localBibleService = new LocalBibleService();