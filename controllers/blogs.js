const blogRouter = require('express').Router();
const Blog = require('../models/blog');
const User = require('../models/user');

blogRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user')
  response.json(blogs);
});

blogRouter.post('/', async (request, response) => {
  const newBlog = request.body
  if (newBlog.author && newBlog.title) {
    const blog = new Blog(newBlog);
    const savedBlog = await blog.save()
    const user = await User.findById(request.body.user)
    user.blogs = user.blogs.concat(savedBlog._id)
    await user.save();

    response.status(201).json(savedBlog)
  } else {
    response.status(400).end();
  }
});

blogRouter.delete('/:id', async(request, response) => {
  await Blog.findByIdAndDelete(request.params.id);
  response.status(204).end();
});

blogRouter.put('/:id', async(request, response) => {
  const newBlog = {
    title: request.body.title,
    author: request.body.author,
    likes: request.body.likes,
    url: request.body.url,
  };

  const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, newBlog, { new: true });
  response.json(updatedBlog);
})

module.exports = blogRouter;