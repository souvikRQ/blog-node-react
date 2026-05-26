import { api } from '@/lib/api-client.js';
import { Comment, CreateCommentDTO, CommentStatus } from '@blog/shared-types';

export const commentsApi = {
  async getComments(blogId: string) {
    const res = await api.get<Comment[]>(`/comments/blog/${blogId}`);
    return res.data;
  },

  async submitComment(blogId: string, data: CreateCommentDTO) {
    const res = await api.post<Comment>(`/comments/blog/${blogId}`, data);
    return res.data;
  },

  async getMyComments() {
    const res = await api.get<Comment[]>('/comments/dashboard/my-comments');
    return res.data;
  },

  async updateCommentStatus(id: string, status: CommentStatus) {
    const res = await api.patch<Comment>(`/comments/${id}/status`, { status });
    return res.data;
  },

  async deleteComment(id: string) {
    const res = await api.delete<{ message: string }>(`/comments/${id}`);
    return res.data;
  },
};
