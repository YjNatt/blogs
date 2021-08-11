const helper = require('./test_helper');
const Blog = require('../models/blog');
const supertest = require('supertest');
const app = require('../index');
const api = supertest(app);


beforeEach(async () => {
  await Blog.deleteMany({});
  for (index = 0; index < helper.initialBlogs.length; index += 1) {
    const blog = new Blog(helper.initialBlogs[index]);
    await blog.save();
  }
});

test('blogs returned as json', async () => {
  const request = await api.get('/api/blogs')
                            .expect(200)
                            .expect('Content-Type', /application\/json/);
})

test('blogs returned the corrent number of blog posts', async () => {
  const request = await api.get('/api/blogs')
  const blogs = request.body;
  expect(blogs).toHaveLength(helper.initialBlogs.length)
});

test('blog identifier attribute is id', async () => {
  const request = await api.get('/api/blogs')
  expect(request.body[0]).toBeDefined();
});