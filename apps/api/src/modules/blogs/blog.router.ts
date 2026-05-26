import { Router } from 'express';
import { blogController } from './blog.controller.js';
import { validate } from '../../middleware/validate.js';
import {
  createBlogSchema,
  updateBlogSchema,
  idParamSchema,
  slugParamSchema,
  blogQuerySchema,
} from '@blog/shared-schemas';
import { requireAuth, optionalAuth } from '../../middleware/auth.middleware.js';

const router = Router();

// Public routes
router.get(
  '/',
  validate({ query: blogQuerySchema }),
  blogController.listPublic
);

router.get(
  '/slug/:slug',
  optionalAuth,
  validate({ params: slugParamSchema }),
  blogController.getBySlug
);

// Authenticated routes
router.post(
  '/',
  requireAuth,
  validate({ body: createBlogSchema }),
  blogController.create
);

router.get(
  '/dashboard/my-blogs',
  requireAuth,
  validate({ query: blogQuerySchema }),
  blogController.listAuthor
);

router.get(
  '/:id',
  optionalAuth,
  validate({ params: idParamSchema }),
  blogController.getById
);

router.put(
  '/:id',
  requireAuth,
  validate({ params: idParamSchema, body: updateBlogSchema }),
  blogController.update
);

router.delete(
  '/:id',
  requireAuth,
  validate({ params: idParamSchema }),
  blogController.delete
);

export default router;
