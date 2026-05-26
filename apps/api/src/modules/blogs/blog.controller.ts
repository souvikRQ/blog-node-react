import { Response, NextFunction } from 'express';
import { blogService } from './blog.service.js';
import { AuthenticatedRequest } from '../../middleware/auth.middleware.js';

export class BlogController {
  async create(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const blog = await blogService.createBlog(req.user!.id, req.body);
      return res.status(201).json(blog);
    } catch (error) {
      next(error);
    }
  }

  async update(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const blog = await blogService.updateBlog(
        req.params.id,
        req.user!.id,
        req.user!.role,
        req.body
      );
      return res.status(200).json(blog);
    } catch (error) {
      next(error);
    }
  }

  async delete(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const result = await blogService.deleteBlog(
        req.params.id,
        req.user!.id,
        req.user!.role
      );
      return res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  async getBySlug(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const blog = await blogService.getBlogBySlug(
        req.params.slug,
        req.user?.id,
        req.user?.role
      );
      return res.status(200).json(blog);
    } catch (error) {
      next(error);
    }
  }

  async getById(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const blog = await blogService.getBlogById(
        req.params.id,
        req.user?.id,
        req.user?.role
      );
      return res.status(200).json(blog);
    } catch (error) {
      next(error);
    }
  }

  async listPublic(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const result = await blogService.listPublicBlogs(req.query);
      return res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  async listAuthor(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const result = await blogService.listAuthorBlogs(req.user!.id, req.query);
      return res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }
}

export const blogController = new BlogController();
