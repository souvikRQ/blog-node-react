import { Request, Response } from 'express';

export function getHealth(req: Request, res: Response) {
  return res.status(200).json({ status: 'OK', timestamp: new Date() });
}
