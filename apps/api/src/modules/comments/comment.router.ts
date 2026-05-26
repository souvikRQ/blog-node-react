import { Router } from 'express';
import { commentController } from './comment.controller.js';
import { validate } from '../../middleware/validate.js';
import {
  createCommentSchema,
  updateCommentStatusSchema,
  idParamSchema,
  blogIdParamSchema,
} from '@blog/shared-schemas';
import { requireAuth, optionalAuth } from '../../middleware/auth.middleware.js';
import { commentRateLimiter } from '../../middleware/rate-limit.js';

const router = Router();

// Public routes
router.get(
  '/blog/:blogId',
  validate({ params: blogIdParamSchema }),
  commentController.listByBlog
);

router.post(
  '/blog/:blogId',
  optionalAuth,
  commentRateLimiter,
  validate({ params: blogIdParamSchema, body: createCommentSchema }),
  commentController.create
);

// Authenticated routes
router.get(
  '/dashboard/my-comments',
  requireAuth,
  commentController.listForBlogOwner
);

router.patch(
  '/:id/status',
  requireAuth,
  validate({ params: idParamSchema, body: updateCommentStatusSchema }),
  commentController.updateStatus
);

router.delete(
  '/:id',
  requireAuth,
  validate({ params: idParamSchema }),
  commentController.delete
);

export default router;
