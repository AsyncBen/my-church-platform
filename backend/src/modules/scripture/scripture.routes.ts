import { Router, Request, Response } from "express";
import { scriptureService } from "./services/scripture.service";
import { validate, scriptureSearchSchema, scriptureReferenceSchema } from "./validators/scripture.validators";

const router = Router();

/**
 * Search for scriptures
 * GET /scripture/search?query=love&version=kjv
 */
router.get("/search", async (req: Request, res: Response) => {
  try {
    const { query, version } = validate(scriptureSearchSchema, req.query);

    const results = await scriptureService.searchScriptures(
      query,
      version === "api-bible" ? "api-bible" : version === "kjv" ? "local" : "any",
      20
    );

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

    const results = await scriptureService.getScripture(
      reference,
      version === "api-bible" ? "api-bible" : version === "kjv" ? "local" : "any"
    );

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

export default router;
