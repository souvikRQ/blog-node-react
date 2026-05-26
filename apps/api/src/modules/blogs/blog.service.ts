import { BlogModel } from './blog.model.js';
import { AppError } from '../../middleware/error.middleware.js';
import { CreateBlogDTO, UpdateBlogDTO, BlogFilters } from '@blog/shared-types';
import { Types } from 'mongoose';

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export class BlogService {
  private async getUniqueSlug(title: string): Promise<string> {
    const baseSlug = generateSlug(title);
    let slug = baseSlug;
    let count = 0;
    while (await BlogModel.findOne({ slug })) {
      count++;
      slug = `${baseSlug}-${Math.random().toString(36).substring(2, 7)}`;
      if (count > 5) break;
    }
    return slug;
  }

  async createBlog(authorId: string, data: CreateBlogDTO) {
    const slug = await this.getUniqueSlug(data.title);
    const publishedAt = data.status === 'published' ? new Date() : undefined;

    const blog = await BlogModel.create({
      ...data,
      slug,
      author: new Types.ObjectId(authorId),
      publishedAt,
    });
    return blog;
  }

  async updateBlog(
    blogId: string,
    userId: string,
    userRole: string,
    data: UpdateBlogDTO
  ) {
    const blog = await BlogModel.findById(blogId);
    if (!blog) {
      throw new AppError(404, 'Blog not found');
    }

    if (blog.author.toString() !== userId && userRole !== 'admin') {
      throw new AppError(403, 'Permission denied');
    }

    const updates: any = { ...data };

    if (data.title && data.title !== blog.title) {
      updates.slug = await this.getUniqueSlug(data.title);
    }

    if (data.status === 'published' && blog.status !== 'published') {
      updates.publishedAt = new Date();
    } else if (data.status === 'draft') {
      updates.publishedAt = null;
    }

    const updatedBlog = await BlogModel.findByIdAndUpdate(blogId, updates, {
      new: true,
      runValidators: true,
    }).populate('author', 'name email avatarUrl role');

    return updatedBlog;
  }

  async deleteBlog(blogId: string, userId: string, userRole: string) {
    const blog = await BlogModel.findById(blogId);
    if (!blog) {
      throw new AppError(404, 'Blog not found');
    }

    if (blog.author.toString() !== userId && userRole !== 'admin') {
      throw new AppError(403, 'Permission denied');
    }

    await blog.deleteOne();
    return { message: 'Blog deleted successfully' };
  }

  async getBlogBySlug(slug: string, userId?: string, userRole?: string) {
    const blog = await BlogModel.findOne({ slug }).populate(
      'author',
      'name email avatarUrl role'
    );
    if (!blog) {
      throw new AppError(404, 'Blog not found');
    }

    if (blog.status === 'draft') {
      if (
        !userId ||
        (blog.author._id.toString() !== userId && userRole !== 'admin')
      ) {
        throw new AppError(403, 'Permission denied to view draft');
      }
    }

    return blog;
  }

  async listPublicBlogs(filters: BlogFilters) {
    const { page = 1, limit = 10, search, tag, sort = 'newest' } = filters;
    const query: any = { status: 'published' };

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { excerpt: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } },
      ];
    }

    if (tag) {
      query.tags = tag;
    }

    const sortOptions: any = {};
    if (sort === 'newest') sortOptions.publishedAt = -1;
    else if (sort === 'oldest') sortOptions.publishedAt = 1;
    else sortOptions.publishedAt = -1;

    const skip = (page - 1) * limit;
    const [blogs, total] = await Promise.all([
      BlogModel.find(query)
        .sort(sortOptions)
        .skip(skip)
        .limit(limit)
        .populate('author', 'name email avatarUrl role'),
      BlogModel.countDocuments(query),
    ]);

    return {
      blogs,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }

  async listAuthorBlogs(authorId: string, filters: BlogFilters) {
    const { page = 1, limit = 10, search, status } = filters;
    const query: any = { author: new Types.ObjectId(authorId) };

    if (status) {
      query.status = status;
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { excerpt: { $regex: search, $options: 'i' } },
      ];
    }

    const skip = (page - 1) * limit;
    const [blogs, total] = await Promise.all([
      BlogModel.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit),
      BlogModel.countDocuments(query),
    ]);

    return {
      blogs,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }

  async getBlogById(blogId: string, userId?: string, userRole?: string) {
    const blog = await BlogModel.findById(blogId).populate(
      'author',
      'name email avatarUrl role'
    );
    if (!blog) {
      throw new AppError(404, 'Blog not found');
    }

    if (blog.status === 'draft') {
      if (
        !userId ||
        (blog.author._id.toString() !== userId && userRole !== 'admin')
      ) {
        throw new AppError(403, 'Permission denied');
      }
    }

    return blog;
  }
}

export const blogService = new BlogService();
