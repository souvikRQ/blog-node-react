import request from 'supertest';
import app from '../../src/app.js';
import { UserModel } from '../../src/modules/users/user.model.js';
import { BlogModel } from '../../src/modules/blogs/blog.model.js';

describe('Blogs Endpoints Integration', () => {
  let author1Cookie: string;
  let author2Cookie: string;
  let author1Id: string;

  beforeEach(async () => {
    // 1. Create two test authors
    const res1 = await request(app).post('/api/auth/register').send({
      name: 'Author One',
      email: 'author1@example.com',
      password: 'Password123!',
      confirmPassword: 'Password123!',
    });
    author1Cookie = res1.headers['set-cookie'][0].split(';')[0];
    author1Id = res1.body.id;

    const res2 = await request(app).post('/api/auth/register').send({
      name: 'Author Two',
      email: 'author2@example.com',
      password: 'Password123!',
      confirmPassword: 'Password123!',
    });
    author2Cookie = res2.headers['set-cookie'][0].split(';')[0];
  });

  describe('POST /api/blogs', () => {
    it('should create a blog post in draft mode by default', async () => {
      const res = await request(app)
        .post('/api/blogs')
        .set('Cookie', [author1Cookie])
        .send({
          title: 'My First Awesome Post',
          excerpt: 'Short description about this post',
          content: 'This is the long content detail of the blog post.',
        });

      expect(res.status).toBe(201);
      expect(res.body.status).toBe('draft');
      expect(res.body.slug).toBe('my-first-awesome-post');
      expect(res.body.author).toBe(author1Id);
    });

    it('should block anonymous users from creating blogs', async () => {
      const res = await request(app).post('/api/blogs').send({
        title: 'Anonymous Title Here',
      });
      expect(res.status).toBe(401);
    });
  });

  describe('PUT /api/blogs/:id', () => {
    it('should allow author to update their own blog', async () => {
      const createRes = await request(app)
        .post('/api/blogs')
        .set('Cookie', [author1Cookie])
        .send({
          title: 'Initial Blog Title',
          excerpt: 'Short summary here',
          content: 'Detailed body here',
        });

      const blogId = createRes.body.id;

      const updateRes = await request(app)
        .put(`/api/blogs/${blogId}`)
        .set('Cookie', [author1Cookie])
        .send({
          title: 'Updated Blog Title',
        });

      expect(updateRes.status).toBe(200);
      expect(updateRes.body.title).toBe('Updated Blog Title');
      expect(updateRes.body.slug).toBe('updated-blog-title');
    });

    it('should block authors from updating someone else\'s blog', async () => {
      const createRes = await request(app)
        .post('/api/blogs')
        .set('Cookie', [author1Cookie])
        .send({
          title: 'Initial Blog Title',
          excerpt: 'Short summary here',
          content: 'Detailed body here',
        });

      const blogId = createRes.body.id;

      const updateRes = await request(app)
        .put(`/api/blogs/${blogId}`)
        .set('Cookie', [author2Cookie]) // Using author 2 session
        .send({
          title: 'Hacked Title',
        });

      expect(updateRes.status).toBe(403);
    });
  });

  describe('GET /api/blogs (Public listing)', () => {
    it('should show only published blogs, omitting drafts', async () => {
      // 1. Create a draft blog
      await request(app)
        .post('/api/blogs')
        .set('Cookie', [author1Cookie])
        .send({
          title: 'Draft Post Title',
          excerpt: 'Short summary here',
          content: 'Detailed body here',
          status: 'draft',
        });

      // 2. Create a published blog
      await request(app)
        .post('/api/blogs')
        .set('Cookie', [author1Cookie])
        .send({
          title: 'Published Post Title',
          excerpt: 'Short summary here',
          content: 'Detailed body here',
          status: 'published',
        });

      const res = await request(app).get('/api/blogs');
      expect(res.status).toBe(200);
      expect(res.body.blogs.length).toBe(1);
      expect(res.body.blogs[0].title).toBe('Published Post Title');
    });
  });
});
