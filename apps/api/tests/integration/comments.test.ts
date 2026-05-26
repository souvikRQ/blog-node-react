import request from 'supertest';
import app from '../../src/app.js';
import { UserModel } from '../../src/modules/users/user.model.js';
import { BlogModel } from '../../src/modules/blogs/blog.model.js';
import { CommentModel } from '../../src/modules/comments/comment.model.js';

describe('Comments Endpoints Integration', () => {
  let authorCookie: string;
  let blogId: string;

  beforeEach(async () => {
    // 1. Register author
    const regRes = await request(app).post('/api/auth/register').send({
      name: 'Blog Owner',
      email: 'owner@example.com',
      password: 'Password123!',
      confirmPassword: 'Password123!',
    });
    authorCookie = regRes.headers['set-cookie'][0].split(';')[0];

    // 2. Create a published blog
    const blogRes = await request(app)
      .post('/api/blogs')
      .set('Cookie', [authorCookie])
      .send({
        title: 'Commentable Blog Post',
        excerpt: 'Short description here',
        content: 'Detailed body here',
        status: 'published',
      });
    blogId = blogRes.body.id;
  });

  describe('POST /api/comments/blog/:blogId', () => {
    it('should submit a comment as a public guest', async () => {
      const res = await request(app)
        .post(`/api/comments/blog/${blogId}`)
        .send({
          content: 'This is a public comment from guest.',
          guestName: 'John Doe',
          guestEmail: 'john@example.com',
        });

      expect(res.status).toBe(201);
      expect(res.body.content).toBe('This is a public comment from guest.');
      expect(res.body.guestName).toBe('John Doe');
      expect(res.body.status).toBe('approved');
    });

    it('should submit a comment as an authenticated user without guest fields', async () => {
      const res = await request(app)
        .post(`/api/comments/blog/${blogId}`)
        .set('Cookie', [authorCookie])
        .send({
          content: 'Logged-in user commenting here.',
        });

      expect(res.status).toBe(201);
      expect(res.body.content).toBe('Logged-in user commenting here.');
      expect(res.body.author).toBeDefined();
      expect(res.body.guestName).toBeUndefined();
    });

    it('should reject guest comment if missing guest fields', async () => {
      const res = await request(app)
        .post(`/api/comments/blog/${blogId}`)
        .send({
          content: 'I want to comment anonymously but missing name/email.',
        });

      expect(res.status).toBe(400);
    });
  });

  describe('PATCH /api/comments/:id/status', () => {
    it('should allow the blog author to moderate/hide comments', async () => {
      const commentRes = await request(app)
        .post(`/api/comments/blog/${blogId}`)
        .send({
          content: 'Inappropriate spam comment.',
          guestName: 'Spammer',
          guestEmail: 'spam@example.com',
        });
      const commentId = commentRes.body.id;

      const modRes = await request(app)
        .patch(`/api/comments/${commentId}/status`)
        .set('Cookie', [authorCookie])
        .send({
          status: 'hidden',
        });

      expect(modRes.status).toBe(200);
      expect(modRes.body.status).toBe('hidden');
    });

    it('should block non-blog-owners from moderating comments', async () => {
      const commentRes = await request(app)
        .post(`/api/comments/blog/${blogId}`)
        .send({
          content: 'Inappropriate spam comment.',
          guestName: 'Spammer',
          guestEmail: 'spam@example.com',
        });
      const commentId = commentRes.body.id;

      // Register separate author
      const otherRes = await request(app).post('/api/auth/register').send({
        name: 'Other Author',
        email: 'other@example.com',
        password: 'Password123!',
        confirmPassword: 'Password123!',
      });
      const otherCookie = otherRes.headers['set-cookie'][0].split(';')[0];

      const modRes = await request(app)
        .patch(`/api/comments/${commentId}/status`)
        .set('Cookie', [otherCookie])
        .send({
          status: 'hidden',
        });

      expect(modRes.status).toBe(403);
    });
  });
});
