export type UserRole = 'author' | 'admin' | 'guest';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export type BlogStatus = 'draft' | 'published';

export interface Blog {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage?: string;
  tags: string[];
  status: BlogStatus;
  author: string | User; // Can be ID or populated User object
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export type CommentStatus = 'approved' | 'pending' | 'hidden';

export interface Comment {
  id: string;
  blog: string; // Blog ID
  author?: string | User; // Optional populated user reference
  guestName?: string; // Required if author is absent
  guestEmail?: string; // Required if author is absent
  content: string;
  status: CommentStatus;
  createdAt: string;
  updatedAt: string;
}

// Authentication Payloads & DTOs
export interface RegisterRequest {
  name: string;
  email: string;
  password?: string;
  confirmPassword?: string;
}

export interface LoginRequest {
  email: string;
  password?: string;
}

export interface UserDTO {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl?: string;
}

// Blog Payloads & DTOs
export interface CreateBlogDTO {
  title: string;
  excerpt: string;
  content: string;
  coverImage?: string;
  tags?: string[];
  status?: BlogStatus;
}

export interface UpdateBlogDTO {
  title?: string;
  excerpt?: string;
  content?: string;
  coverImage?: string;
  tags?: string[];
  status?: BlogStatus;
}

export interface BlogFilters {
  page?: number;
  limit?: number;
  search?: string;
  tag?: string;
  status?: BlogStatus;
  sort?: 'newest' | 'oldest' | 'popular';
}

// Comment Payloads & DTOs
export interface CreateCommentDTO {
  content: string;
  guestName?: string;
  guestEmail?: string;
}

export interface UpdateCommentStatusDTO {
  status: CommentStatus;
}

// Password Change Payload
export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
  confirmNewPassword: string;
}