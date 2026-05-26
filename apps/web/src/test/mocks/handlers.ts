import { http, HttpResponse } from 'msw';

export const handlers = [
  http.get('/api/auth/me', () => {
    return HttpResponse.json({
      id: 'user123',
      name: 'Alice Cooper',
      email: 'alice@example.com',
      role: 'author',
    });
  }),

  http.post('/api/auth/login', () => {
    return HttpResponse.json({
      id: 'user123',
      name: 'Alice Cooper',
      email: 'alice@example.com',
      role: 'author',
    });
  }),

  http.post('/api/auth/register', () => {
    return HttpResponse.json({
      id: 'user123',
      name: 'Alice Cooper',
      email: 'alice@example.com',
      role: 'author',
    });
  }),
];
