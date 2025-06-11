import { Request, Response, NextFunction } from 'express';
const { validationResult } = require('express-validator');
import { itemService } from '../services/item.service';

/**
 * Контроллер для получения элементов (GET /api/items)
 */
export const getItems = (req: Request, res: Response): void => {
  const search = req.query.search?.toString() || '';
  const limit = parseInt(req.query.limit as string, 10) || 20;
  const offset = parseInt(req.query.offset as string, 10) || 0;
  const sortBy = (req.query.sortBy as 'order' | 'value') || 'order';
  const sortDir = (req.query.sortDir as 'asc' | 'desc') || 'asc';

  const result = itemService.getItems({ search, limit, offset, sortBy, sortDir });
  res.status(200).json(result);
};

/**
 * Контроллер для обновления флага selected (PATCH /api/items/selection)
 */
export const updateSelection = (req: Request, res: Response, next: NextFunction): void => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
    return;
  }

  const { ids, selected } = req.body as { ids: number[]; selected: boolean };

  try {
    const count = itemService.updateSelection(ids, selected);
    res.status(200).json({ updated: count });
  } catch (err) {
    next(err);
  }
};

export const updateOrder = (req: Request, res: Response, next: NextFunction): void => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
    return;
  }

  const { ids } = req.body as { ids: number[] };

  try {
    const count = itemService.updateOrder(ids);
    res.status(200).json({ updated: count });
  } catch (err) {
    next(err);
  }
};

export const getState = (_req: Request, res: Response): void => {
  const state = itemService.getState();
  res.status(200).json(state);
};

export const resetState = (_req: Request, res: Response): void => {
  itemService.resetState();
  res.status(200).json({ reset: true });
};
