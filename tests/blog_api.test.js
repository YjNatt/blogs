const helper = require('./test_helper');
const Blog = require('../models/blog');
const supertest = require('supertest');
const app = require('../index');
const api = supertest(app);


beforeEach(async() => {
  await Blog.deleteMany({});
  for (index = 0; index < helper.initialBlogs.length; index += 1) {
    const blog = new Blog(helper.initialBlogs[index]);
    await blog.save();
  }
});

test('blogs returned as json', async() => {
  const request = await api.get('/api/blogs')
                            .expect(200)
                            .expect('Content-Type', /application\/json/);
})

test('blogs returned the corrent number of blog posts', async() => {
  const request = await api.get('/api/blogs')
  const blogs = request.body;
  expect(blogs).toHaveLength(helper.initialBlogs.length)
});

test('blog identifier attribute is id', async() => {
  const request = await api.get('/api/blogs')
  expect(request.body[0]).toBeDefined();
});

test('valid blog is added', async() => {
  const newBlog = {
    title: "Blog",
    author: "author",
    url: "url",
    likes: 23
  }

  await api.post('/api/blogs')
           .send(newBlog)
           .expect(201)
           .expect('Content-Type', /application\/json/);

  const response = await api.get('/api/blogs');
  const blogs = response.body;
  expect(blogs).toHaveLength(helper.initialBlogs.length + 1);

  const likes = blogs.map(({likes}) => likes)
  expect(likes).toContain(23);
});