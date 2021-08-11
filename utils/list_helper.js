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

const mostBlogs = blogs => {
  if (blogs.length === 0) return { author: '', blogs: 0 };

  const authorsToCount = blogs.reduce((authorsToCount, blog) => {
    const author = authorsToCount.find(({ author }) => {
      return author === blog.author;
    });

    if (author) {
      author.blogs += 1;
    } else {
      authorsToCount.push({ author: blog.author, blogs: 1});
    }

    return authorsToCount;
  }, []);

  return authorsToCount.sort((blogData1, blogData2) => {
    return blogData2.blogs - blogData1.blogs;
  })[0];
};

const mostLikes = blogs => {
  if (blogs.length === 0) return { author: '', likes: 0 };

  const reducer = (authorsToLikes, blog) => {
    const authorToLikes = authorsToLikes.find(({ author }) => author === blog.author);

    if (authorToLikes) {
      authorToLikes.likes += blog.likes;
    } else {
      authorsToLikes.push({ author: blog.author, likes: blog.likes });
    }

    return authorsToLikes;
  };

  return blogs.reduce(reducer, []).sort((blogData1, blogData2) => {
    return blogData2.likes - blogData1.likes
  })[0]
};

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes,
}