import { api } from '@/lib/api-client.js';
import { Blog, BlogFilters, CreateBlogDTO, UpdateBlogDTO } from '@blog/shared-types';

export const blogsApi = {
  async getBlogs(filters: BlogFilters = {}) {
    const res = await api.get<{ blogs: Blog[]; pagination: any }>('/blogs', { params: filters });
    return res.data;
  },

  async getBlogBySlug(slug: string) {
    const res = await api.get<Blog>(`/blogs/slug/${slug}`);
    return res.data;
  },

  async getBlogById(id: string) {
    const res = await api.get<Blog>(`/blogs/${id}`);
    return res.data;
  },

  async getMyBlogs(filters: BlogFilters = {}) {
    const res = await api.get<{ blogs: Blog[]; pagination: any }>('/blogs/dashboard/my-blogs', { params: filters });
    return res.data;
  },

  async createBlog(data: CreateBlogDTO) {
    const res = await api.post<Blog>('/blogs', data);
    return res.data;
  },

  async updateBlog(id: string, data: UpdateBlogDTO) {
    const res = await api.put<Blog>(`/blogs/${id}`, data);
    return res.data;
  },

  async deleteBlog(id: string) {
    const res = await api.delete<{ message: string }>(`/blogs/${id}`);
    return res.data;
  },
};
