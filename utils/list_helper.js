const dummy = blogs => {
  return 1;
}

const totalLikes = blogs => {
  return blogs.reduce((sum, blog) => {
    return sum + blog.likes
  }, 0);
}

const favoriteBlog = blogs => {
  const sortedBlogs = [...blogs].sort((blog1, blog2) => {
    return blog2.likes - blog1.likes
  });

  const title = sortedBlogs[0] ? sortedBlogs[0].title : "";
  const author = sortedBlogs[0] ? sortedBlogs[0].author : "";
  const likes = sortedBlogs[0] ? sortedBlogs[0].likes : 0;

  return { title, author, likes };
};

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
}