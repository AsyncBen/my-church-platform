import { Response } from 'express';

export function success(res: Response, data: any, message = 'Success') {
  return res.status(200).json({ message, data });
}

export function fail(res: Response, message = 'Failed', status = 400) {
  return res.status(status).json({ message });
}
