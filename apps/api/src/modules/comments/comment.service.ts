import { CommentModel } from './comment.model.js';
import { BlogModel } from '../blogs/blog.model.js';
import { AppError } from '../../middleware/error.middleware.js';
import { CreateCommentDTO, CommentStatus } from '@blog/shared-types';
import { Types } from 'mongoose';

export class CommentService {
  async createComment(
    blogId: string,
    authorId: string | undefined,
    data: CreateCommentDTO
  ) {
    const blog = await BlogModel.findById(blogId);
    if (!blog) {
      throw new AppError(404, 'Blog not found');
    }

    if (blog.status !== 'published') {
      throw new AppError(400, 'Cannot comment on a draft blog');
    }

    const commentData: any = {
      blog: new Types.ObjectId(blogId),
      content: data.content,
      status: 'approved',
    };

    if (authorId) {
      commentData.author = new Types.ObjectId(authorId);
    } else {
      if (!data.guestName || !data.guestEmail) {
        throw new AppError(
          400,
          'Guest name and email are required for public comments'
        );
      }
      commentData.guestName = data.guestName;
      commentData.guestEmail = data.guestEmail;
    }

    const comment = await CommentModel.create(commentData);
    return comment;
  }

  async listCommentsByBlog(blogId: string) {
    const comments = await CommentModel.find({
      blog: new Types.ObjectId(blogId),
      status: 'approved',
    })
      .sort({ createdAt: -1 })
      .populate('author', 'name email avatarUrl role');

    return comments;
  }

  async listCommentsForBlogOwner(userId: string) {
    const blogs = await BlogModel.find({ author: new Types.ObjectId(userId) });
    const blogIds = blogs.map((b) => b._id);

    const comments = await CommentModel.find({ blog: { $in: blogIds } })
      .sort({ createdAt: -1 })
      .populate('author', 'name email avatarUrl role')
      .populate('blog', 'title slug');

    return comments;
  }

  async updateCommentStatus(
    commentId: string,
    userId: string,
    userRole: string,
    status: CommentStatus
  ) {
    const comment = await CommentModel.findById(commentId).populate('blog');
    if (!comment) {
      throw new AppError(404, 'Comment not found');
    }

    const blog = comment.blog as any;
    if (blog.author.toString() !== userId && userRole !== 'admin') {
      throw new AppError(403, 'Permission denied');
    }

    comment.status = status;
    await comment.save();
    return comment;
  }

  async deleteComment(commentId: string, userId: string, userRole: string) {
    const comment = await CommentModel.findById(commentId).populate('blog');
    if (!comment) {
      throw new AppError(404, 'Comment not found');
    }

    const blog = comment.blog as any;
    const isCommentAuthor = comment.author?.toString() === userId;
    const isBlogAuthor = blog.author.toString() === userId;

    if (!isCommentAuthor && !isBlogAuthor && userRole !== 'admin') {
      throw new AppError(403, 'Permission denied');
    }

    await comment.deleteOne();
    return { message: 'Comment deleted successfully' };
  }
}

export const commentService = new CommentService();
