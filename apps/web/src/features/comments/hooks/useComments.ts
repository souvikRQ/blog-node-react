import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { commentsApi } from '../api/comments-api.js';
import { CreateCommentDTO, CommentStatus } from '@blog/shared-types';

export const useBlogComments = (blogId: string) => {
  return useQuery({
    queryKey: ['comments', blogId],
    queryFn: () => commentsApi.getComments(blogId),
    enabled: !!blogId,
  });
};

export const useMyComments = () => {
  return useQuery({
    queryKey: ['my-comments'],
    queryFn: () => commentsApi.getMyComments(),
  });
};

export const useSubmitCommentMutation = (blogId: string, onResetForm?: () => void) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateCommentDTO) =>
      commentsApi.submitComment(blogId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments', blogId] });
      onResetForm?.();
    },
  });
};

export const useUpdateCommentStatusMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: CommentStatus }) =>
      commentsApi.updateCommentStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-comments'] });
    },
  });
};

export const useDeleteCommentMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => commentsApi.deleteComment(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-comments'] });
    },
  });
};
