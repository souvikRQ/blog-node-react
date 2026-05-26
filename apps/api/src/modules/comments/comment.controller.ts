import { Response, NextFunction } from 'express';
import { commentService } from './comment.service.js';
import { AuthenticatedRequest } from '../../middleware/auth.middleware.js';

export class CommentController {
  async create(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const comment = await commentService.createComment(
        req.params.blogId,
        req.user?.id,
        req.body
      );
      return res.status(201).json(comment);
    } catch (error) {
      next(error);
    }
  }

  async listByBlog(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      const comments = await commentService.listCommentsByBlog(req.params.blogId);
      return res.status(200).json(comments);
    } catch (error) {
      next(error);
    }
  }

  async listForBlogOwner(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      const comments = await commentService.listCommentsForBlogOwner(
        req.user!.id
      );
      return res.status(200).json(comments);
    } catch (error) {
      next(error);
    }
  }

  async updateStatus(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      const comment = await commentService.updateCommentStatus(
        req.params.id,
        req.user!.id,
        req.user!.role,
        req.body.status
      );
      return res.status(200).json(comment);
    } catch (error) {
      next(error);
    }
  }

  async delete(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const result = await commentService.deleteComment(
        req.params.id,
        req.user!.id,
        req.user!.role
      );
      return res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }
}

export const commentController = new CommentController();
