const blogRouter = require('express').Router();
const Blog = require('../models/blog');
const User = require('../models/user');
const jwt = require('jsonwebtoken');
const { userExtractor } = require('../utils/middleware');

blogRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user')
  response.json(blogs);
});

blogRouter.post('/', userExtractor, async (request, response) => {
  const newBlog = request.body
  const decodedToken = jwt.verify(request.token, process.env.SECRET)

  if (!request.token || !decodedToken.id) {
    return response.status(401).json({ error: 'token missing or invalid' });
  }

  if (newBlog.author && newBlog.title) {
    const blog = new Blog(newBlog);
    const savedBlog = await blog.save()
    const user = request.user;
    user.blogs = user.blogs.concat(savedBlog._id)
    await user.save();

    response.status(201).json(savedBlog)
  } else {
    response.status(400).end();
  }
});

blogRouter.delete('/:id', async(request, response) => {
  const decodedToken = jwt.verify(request.token, process.env.SECRET)

  if (!request.token || !decodedToken.id) {
    return response.status(401).json({ error: 'token missing or invalid' });
  }

  const blog = await Blog.findById(request.params.id);

  if (blog && (blog.user.toString() === decodedToken.id)) {
    await Blog.findByIdAndDelete(request.params.id);
    response.status(204).end();
  } else {
    response.status(404).end();
  }

});

blogRouter.put('/:id', async(request, response) => {
  const decodedToken = jwt.verify(request.token, process.env.SECRET)

  if (!request.token || !decodedToken.id) {
    return response.status(401).json({ error: 'token missing or invalid' });
  }

  const blog = await Blog.findById(request.params.id);

  if (blog && (blog.user.toString() === decodedToken.id)) {
    const newBlog = {
      title: request.body.title,
      author: request.body.author,
      likes: request.body.likes,
      url: request.body.url,
    };


    const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, newBlog, { new: true });
    response.json(updatedBlog);
  } else {
    response.status(404).end()
  }
})

module.exports = blogRouter;