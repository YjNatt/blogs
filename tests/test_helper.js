const Blog = require('../models/blog');

const initialBlogs = [
  {
    title: "Blog 1",
    author: "author 1",
    url: "url1",
    likes: 0
  },
  {
    title: "Blog 2",
    author: "author 1",
    url: "url2",
    likes: 4
  },
  {
    title: "Blog 3",
    author: "author 2",
    url: "url3",
    likes: 10
  },
]

module.exports = { initialBlogs };