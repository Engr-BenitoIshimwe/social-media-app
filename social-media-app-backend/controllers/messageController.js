const Message = require('../models/Message');

exports.sendMessage = async (req, res) => {
  const { recipient, content } = req.body;

  const message = new Message({
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
