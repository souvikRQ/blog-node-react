import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { blogsApi } from '../api/blogs-api.js';
import { BlogFilters, CreateBlogDTO, UpdateBlogDTO } from '@blog/shared-types';

export const useBlogsList = (filters: BlogFilters = {}) => {
  return useQuery({
    queryKey: ['blogs', filters],
    queryFn: () => blogsApi.getBlogs(filters),
  });
};

export const useBlogDetail = (slug: string) => {
  return useQuery({
    queryKey: ['blog', slug],
    queryFn: () => blogsApi.getBlogBySlug(slug),
    enabled: !!slug,
  });
};

export const useBlogById = (id: string) => {
  return useQuery({
    queryKey: ['blog-by-id', id],
    queryFn: () => blogsApi.getBlogById(id),
    enabled: !!id,
  });
};

export const useMyBlogs = (filters: BlogFilters = {}, enabled: boolean = true) => {
  return useQuery({
    queryKey: ['my-blogs', filters],
    queryFn: () => blogsApi.getMyBlogs(filters),
    enabled,
  });
};

export const useCreateBlogMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateBlogDTO) => blogsApi.createBlog(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-blogs'] });
      queryClient.invalidateQueries({ queryKey: ['blogs'] });
    },
  });
};

export const useUpdateBlogMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateBlogDTO }) =>
      blogsApi.updateBlog(id, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['my-blogs'] });
      queryClient.invalidateQueries({ queryKey: ['blogs'] });
      queryClient.invalidateQueries({ queryKey: ['blog', data.slug] });
    },
  });
};

export const useDeleteBlogMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => blogsApi.deleteBlog(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-blogs'] });
      queryClient.invalidateQueries({ queryKey: ['blogs'] });
    },
  });
};
