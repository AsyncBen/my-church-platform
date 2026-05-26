import { Request, Response } from 'express';
import {
  createGiving,
  getUserGivings,
  getAllGivings,
  getGivingSummary,
} from './giving.service';
import { createGivingSchema } from './giving.validation';

export const submitGiving = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;
    const parsed = createGivingSchema.parse(req.body);
    const result = await createGiving(parsed, userId);

    return res.status(201).json({
      success: true,
      data: result,
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error.message || 'Failed to submit giving',
    });
  }
};

export const getMyGivings = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;
    const result = await getUserGivings(userId);

    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error.message || 'Failed to fetch givings',
    });
  }
};

export const getAllGivingsController = async (req: Request, res: Response) => {
  try {
    const { type, search } = req.query;
    const result = await getAllGivings({
      type: type as string | undefined,
      search: search as string | undefined,
    });

    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error.message || 'Failed to fetch givings',
    });
  }
};

export const getSummary = async (req: Request, res: Response) => {
  try {
    const result = await getGivingSummary();

    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error.message || 'Failed to fetch summary',
    });
  }
};
