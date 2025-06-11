import { Router } from 'express';
import { getItems, updateOrder, updateSelection } from '../controllers/item.controller';
const { body } = require('express-validator');

const router = Router();

router.get('/', getItems);

router.patch(
  '/selection',
  [
    body('ids').isArray({ min: 1 }).withMessage('ids must be a non-empty array'),
    body('ids.*').isInt({ min: 1 }).withMessage('each id must be an integer ≥ 1'),
    body('selected').isBoolean().withMessage('selected must be a boolean'),
  ],
  updateSelection
);

router.patch(
  '/order',
  [
    body('ids').isArray({ min: 1 }).withMessage('ids must be a non-empty array'),
    body('ids.*').isInt({ min: 1 }).withMessage('each id must be an integer ≥ 1'),
  ],
  updateOrder
);

export default router;
