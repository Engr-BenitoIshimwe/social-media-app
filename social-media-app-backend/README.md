To build a mobile application for a Social Media App, we'll focus on demonstrating backend development, secure authentication, RESTful API implementation, and responsive design principles. For brevity, I'll provide an outline and code snippets that cover the essential aspects of the application.

### Backend Setup

For the backend, we'll use Node.js with Express.js for RESTful API implementation and MongoDB for data storage.

#### Project Structure

```
social-media-app-backend/
│
├── controllers/
│   ├── authController.js
│   ├── postController.js
│   ├── userController.js
│   └── messageController.js
│
├── models/
│   ├── User.js
│   ├── Post.js
│   └── Message.js
│
├── routes/
│   ├── authRoutes.js
│   ├── postRoutes.js
│   ├── userRoutes.js
│   └── messageRoutes.js
│
├── middleware/
│   ├── authMiddleware.js
│   └── roleMiddleware.js
│
├── utils/
│   ├── db.js
│   └── jwt.js
│
├── .env
├── app.js
├── package.json
└── README.md
```

### Step 1: Setup and Dependencies

1. Initialize a Node.js project and install necessary dependencies.

```bash
mkdir social-media-app-backend
cd social-media-app-backend
npm init -y
npm install express mongoose bcryptjs jsonwebtoken dotenv
```

### Step 2: Environment Variables

Create a `.env` file to store environment variables securely.

```
PORT=3000
MONGODB_URI=mongodb://localhost:27017/socialMediaApp
JWT_SECRET=your_jwt_secret
```

### Step 3: Database Connection

Create `utils/db.js` to connect to MongoDB.

```javascript
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connected');
  } catch (error) {
    console.error('MongoDB connection failed', error);
    process.exit(1);
  }
};

module.exports = connectDB;
```

### Step 4: Models

Create `models/User.js` for user schema.

```javascript
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  bio: { type: String },
  profilePicture: { type: String },
  followers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  following: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
}, { timestamps: true });

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.matchPassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

const User = mongoose.model('User', userSchema);

module.exports = User;
```

Create `models/Post.js` for post schema.

```javascript
const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  content: { type: String, required: true },
  image: { type: String },
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  comments: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    text: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
  }],
}, { timestamps: true });

const Post = mongoose.model('Post', postSchema);

module.exports = Post;
```

Create `models/Message.js` for message schema (for messaging functionality).

```javascript
const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  recipient: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  content: { type: String, required: true },
  read: { type: Boolean, default: false },
}, { timestamps: true });

const Message = mongoose.model('Message', messageSchema);

module.exports = Message;
```

### Step 5: Middleware

Create `middleware/authMiddleware.js` for authentication.

```javascript
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const dotenv = require('dotenv');

dotenv.config();

const authMiddleware = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      req.user = await User.findById(decoded.id).select('-password');
      next();
    } catch (error) {
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    res.status(401).json({ message: 'Not authorized, no token' });
  }
};

module.exports = authMiddleware;
```

Create `middleware/roleMiddleware.js` for role-based access control (if needed).

```javascript
const roleMiddleware = (roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) {
    return res.status(403).json({ message: 'Access forbidden' });
  }
  next();
};

module.exports = roleMiddleware;
```

### Step 6: JWT Utilities

Create `utils/jwt.js` for JWT operations.

```javascript
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

module.exports = generateToken;
```

### Step 7: Controllers

Create `controllers/authController.js` for authentication logic.

```javascript
const User = require('../models/User');
const generateToken = require('../utils/jwt');

exports.registerUser = async (req, res) => {
  const { username, email, password } = req.body;

  const userExists = await User.findOne({ email });

  if (userExists) {
    return res.status(400).json({ message: 'User already exists' });
  }

  const user = await User.create({
    username,
    email,
    password,
  });

  if (user) {
    res.status(201).json({
      _id: user._id,
      username: user.username,
      email: user.email,
      token: generateToken(user._id),
    });
  } else {
    res.status(400).json({ message: 'Invalid user data' });
  }
};

exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    res.json({
      _id: user._id,
      username: user.username,
      email: user.email,
      token: generateToken(user._id),
    });
  } else {
    res.status(401).json({ message: 'Invalid email or password' });
  }
};
```

Create `controllers/postController.js` for post management.

```javascript
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
```

Create `controllers/messageController.js` for messaging functionality.

```javascript
const Message = require('../models/Message');

exports.sendMessage = async (req, res) => {
  const { recipient, content } = req.body;

  const message =

 new Message({
    sender: req.user._id,
    recipient,
    content,
  });

  const sentMessage = await message.save();
  res.status(201).json(sentMessage);
};

exports.getMessages = async (req, res) => {
  const messages = await Message.find({ recipient: req.user._id })
    .populate('sender', '_id username profilePicture')
    .sort({ createdAt: -1 }); // Sort by newest first
  res.json(messages);
};

exports.getMessage = async (req, res) => {
  const message = await Message.findById(req.params.id)
    .populate('sender', '_id username profilePicture')
    .populate('recipient', '_id username profilePicture');

  if (message) {
    res.json(message);
  } else {
    res.status(404).json({ message: 'Message not found' });
  }
};
```

### Step 8: Routes

Create `routes/authRoutes.js`.

```javascript
const express = require('express');
const { registerUser, loginUser } = require('../controllers/authController');
const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);

module.exports = router;
```

Create `routes/postRoutes.js`.

```javascript
const express = require('express');
const {
  createPost,
  getPosts,
  getPost,
  deletePost,
} = require('../controllers/postController');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();

router.use(authMiddleware);

router.post('/', createPost);
router.get('/', getPosts);
router.get('/:id', getPost);
router.delete('/:id', deletePost);

module.exports = router;
```

Create `routes/userRoutes.js`.

```javascript
const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();

// Define user-related routes here

module.exports = router;
```

Create `routes/messageRoutes.js` for messaging routes.

```javascript
const express = require('express');
const {
  sendMessage,
  getMessages,
  getMessage,
} = require('../controllers/messageController');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();

router.use(authMiddleware);

router.post('/', sendMessage);
router.get('/', getMessages);
router.get('/:id', getMessage);

module.exports = router;
```

### Step 9: Main Application

Create `app.js` to set up the Express app.

```javascript
const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./utils/db');
const authRoutes = require('./routes/authRoutes');
const postRoutes = require('./routes/postRoutes');
const messageRoutes = require('./routes/messageRoutes');

dotenv.config();

connectDB();

const app = express();

app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/messages', messageRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
```

### Summary

This backend setup provides the foundation for a social media mobile application. It includes user authentication, post management, messaging functionality, and basic structure for expansion. You can further enhance it with features like likes, comments, notifications, and more detailed user profiles. Additionally, ensure to implement pagination and optimize performance for handling large datasets, and consider integrating third-party APIs for social login (e.g., Google or Facebook login) and sharing functionality.