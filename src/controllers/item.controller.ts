import { Request, Response } from 'express';
import { itemService } from '../services/item.service';

export const getItems = (req: Request, res: Response) => {
  const search = req.query.search?.toString() || '';
  const limit = parseInt(req.query.limit as string, 10) || 20;
  const offset = parseInt(req.query.offset as string, 10) || 0;
  const sortBy = req.query.sortBy?.toString() as 'order' | 'value' | undefined;
  const sortDir = req.query.sortDir?.toString() as 'asc' | 'desc' | undefined;

  const result = itemService.getItems({
    search,
    limit,
    offset,
    sortBy,
    sortDir,
  });

  res.status(200).json(result);
};
