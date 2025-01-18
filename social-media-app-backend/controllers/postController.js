const Post = require('../models/Post');

exports.createPost = async (req, res) => {
  const { content, image } = req.body;

  const post = new Post({
    user: req.user._id,
    content,
    image,
  });

  const createdPost = await post.save();
  res.status(201).json(createdPost);
};

exports.getPosts = async (req, res) => {
  const posts = await Post.find()
    .populate('user', '_id username profilePicture') // Populate user details
    .populate({
      path: 'comments',
      populate: {
        path: 'user',
        select: '_id username',
      },
    })
    .sort({ createdAt: -1 }); // Sort by newest first
  res.json(posts);
};

exports.getPost = async (req, res) => {
  const post = await Post.findById(req.params.id)
    .populate('user', '_id username profilePicture')
    .populate({
      path: 'comments',
      populate: {
        path: 'user',
        select: '_id username',
      },
    });

  if (post) {
    res.json(post);
  } else {
    res.status(404).json({ message: 'Post not found' });
  }
};

exports.deletePost = async (req, res) => {
  const post = await Post.findById(req.params.id);

  if (post && post.user.equals(req.user._id)) {
    await post.remove();
    res.json({ message: 'Post removed' });
  } else {
    res.status(404).json({ message: 'Post not found' });
  }
};
