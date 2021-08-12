const helper = require('./test_helper');
const Blog = require('../models/blog');
const User = require('../models/user');
const supertest = require('supertest');
const app = require('../index');
const api = supertest(app);

beforeEach(async() => {
  await User.deleteMany({});
  const response = await api.post('/api/users')
                   .send(helper.testUserDetails);

  const userId = response.body.id

  await Blog.deleteMany({});
  for (index = 0; index < helper.initialBlogs.length; index += 1) {
    const blog = new Blog({ user: userId, ...helper.initialBlogs[index]});
    await blog.save();
  }

});

describe('fetching blogs', () => {
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
})

describe('adding blogs', () => {
  test('valid blog is added', async() => {
    const newBlog = {
      title: "New blog",
      author: "author",
      url: "url",
      likes: 23
    }

    const users = await helper.usersInDb();
    const user = users[0]
    const credentials = await api.post('/api/login')
                                 .send({ username: user.username, password: 'test' })
                                 .expect(200);
    const token = credentials.body.token;

    await api.post('/api/blogs')
            .send(newBlog)
            .set('Authorization', `bearer ${token}`)
            .expect(201)
            .expect('Content-Type', /application\/json/);

    const response = await api.get('/api/blogs');
    const blogs = response.body;
    expect(blogs).toHaveLength(helper.initialBlogs.length + 1);

    const likes = blogs.map(({likes}) => likes)
    expect(likes).toContain(23);
  });

  test('add blog missing likes property', async () => {
    const newBlog = {
      title: "New blog",
      author: "author",
      url: "url",
    }

    const users = await helper.usersInDb();
    const user = users[0]
    const credentials = await api.post('/api/login')
                                 .send({ username: user.username, password: 'test' })
                                 .expect(200);
    const token = credentials.body.token;

    await api.post('/api/blogs')
            .send(newBlog)
            .set('Authorization', `bearer ${token}`)
            .expect(201)
            .expect('Content-Type', /application\/json/);
    const response = await api.get('/api/blogs');
    const blog = response.body.find(blog => blog.title === "New blog");
    expect(blog.likes).toBe(0);
  });

  test('add blog missing author property', async() => {
    const newBlog = {
      title: "New blog",
      url: "url",
      likes: 23
    }

    const users = await helper.usersInDb();
    const user = users[0]
    const credentials = await api.post('/api/login')
                                 .send({ username: user.username, password: 'test' })
                                 .expect(200);
    const token = credentials.body.token;

    await api.post('/api/blogs')
             .send(newBlog)
             .set('Authorization', `bearer ${token}`)
             .expect(400);

    const response = await api.get('/api/blogs')
    expect(response.body).toHaveLength(helper.initialBlogs.length)
  });

  test('add blog missing title property', async() => {
    const newBlog = {
      author: "author",
      url: "url",
      likes: 23
    }

    const users = await helper.usersInDb();
    const user = users[0]
    const credentials = await api.post('/api/login')
                                 .send({ username: user.username, password: 'test' })
                                 .expect(200);

    const token = credentials.body.token;

    await api.post('/api/blogs')
            .send(newBlog)
            .set('Authorization', `bearer ${token}`)
            .expect(400);

    const response = await api.get('/api/blogs')
    expect(response.body).toHaveLength(helper.initialBlogs.length)
  });
});

describe('deleting blog', () => {
  test('delete a single blog', async() => {
    let response = await api.get('/api/blogs')
    const blog = response.body[0];

    const users = await helper.usersInDb();
    const user = users[0]
    const credentials = await api.post('/api/login')
                                 .send({ username: user.username, password: 'test' })
                                 .expect(200);

    const token = credentials.body.token;

    await api.delete(`/api/blogs/${blog.id}`)
             .set('Authorization', `bearer ${token}`)
             .expect(204)

    response = await api.get('/api/blogs')
    const blogIds = response.body.map(blog => blog.id)
    expect(blogIds).not.toContain(blog.id)
  });
})

describe('updateing blog', () => {
  test('update likes on blog', async() => {
    let response = await api.get('/api/blogs')
    const blog = response.body[0];
    blog.likes = 123;

    const users = await helper.usersInDb();
    const user = users[0]
    const credentials = await api.post('/api/login')
                                 .send({ username: user.username, password: 'test' })
                                 .expect(200);

    const token = credentials.body.token;

    response = await api.put(`/api/blogs/${blog.id}`)
                        .send(blog)
                        .set('Authorization', `bearer ${token}`);

    const updatedBlog = response.body;
    expect(updatedBlog.id).toBe(blog.id);
    expect(updatedBlog.likes).toBe(123);
  });
});