import { Request, Response, NextFunction } from 'express';
const { validationResult } = require('express-validator');
import { itemService } from '../services/item.service';

/**
 * @openapi
 * /items:
 *   get:
 *     summary: Get paginated, searchable, sortable list of items
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *       - in: query
 *         name: offset
 *         schema:
 *           type: integer
 *           default: 0
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           enum: [order, value]
 *       - in: query
 *         name: sortDir
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *     responses:
 *       200:
 *         description: Paginated items
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/GetItemsResponse'
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
 * @openapi
 * /items/selection:
 *   patch:
 *     summary: Update selection state of items
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SelectionPayload'
 *     responses:
 *       200:
 *         description: Number of items updated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 updated:
 *                   type: integer
 *                   example: 10
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

/**
 * @openapi
 * /items/order:
 *   patch:
 *     summary: Update item order
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/OrderPayload'
 *     responses:
 *       200:
 *         description: Number of items updated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 updated:
 *                   type: integer
 *                   example: 10
 */
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

/**
 * @openapi
 * /items/state:
 *   get:
 *     summary: Get current selection and order state
 *     responses:
 *       200:
 *         description: Current selection and order state
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/StateResponse'
 */
export const getState = (_req: Request, res: Response): void => {
  const state = itemService.getState();
  res.status(200).json(state);
};

/**
 * @openapi
 * /items/state/reset:
 *   post:
 *     summary: Reset selection and order state to default
 *     responses:
 *       200:
 *         description: Reset confirmation
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ResetResponse'
 */
export const resetState = (_req: Request, res: Response): void => {
  itemService.resetState();
  res.status(200).json({ reset: true });
};
