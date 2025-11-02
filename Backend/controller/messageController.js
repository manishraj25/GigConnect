import Message from "../models/Message.js";
import User from "../models/User.js";

//Send message
export const sendMessage = async (req, res) => {
  try {
    const { to, content } = req.body;
    const from = req.user._id;

    if (!to || !content)
      return res.status(400).json({ message: "Recipient and content are required" });

    const recipient = await User.findById(to);
    if (!recipient) return res.status(404).json({ message: "Recipient not found" });

    const message = await Message.create({ from, to, content });
    const populatedMsg = await message.populate([
      { path: "from", select: "name profileImage" },
      { path: "to", select: "name profileImage" },
    ]);

    res.status(201).json({ message: "Message sent", data: populatedMsg });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

//Get full conversation between two users
export const getConversation = async (req, res) => {
  try {
    const userId = req.user._id;
    const { otherUserId } = req.params;

    const messages = await Message.find({
      $or: [
        { from: userId, to: otherUserId },
        { from: otherUserId, to: userId },
      ],
    })
      .sort({ createdAt: 1 })
      .populate([
        { path: "from", select: "name profileImage" },
        { path: "to", select: "name profileImage" },
      ]);

    res.status(200).json({ total: messages.length, messages });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

//Mark messages as read (and return count)
export const markAsRead = async (req, res) => {
  try {
    const userId = req.user._id;
    const { from } = req.body;

    const result = await Message.updateMany(
      { from, to: userId, read: false },
      { $set: { read: true } }
    );

    res.status(200).json({ message: "Messages marked as read", updated: result.modifiedCount });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

//Get chat summaries (last message + unread count)
export const getChatsSummary = async (req, res) => {
  try {
    const userId = req.user._id;

    // All messages where user is sender or receiver
    const messages = await Message.find({
      $or: [{ from: userId }, { to: userId }],
    })
      .sort({ createdAt: -1 })
      .populate([
        { path: "from", select: "name profileImage" },
        { path: "to", select: "name profileImage" },
      ]);

    const chats = {};

    for (const msg of messages) {
      const otherUser =
        msg.from._id.toString() === userId.toString() ? msg.to : msg.from;
      const otherId = otherUser._id.toString();

      if (!chats[otherId]) {
        chats[otherId] = {
          user: otherUser,
          lastMessage: msg,
          unreadCount: 0,
        };
      }

      // Count unread messages where current user is the recipient
      if (msg.to._id.toString() === userId.toString() && !msg.read) {
        chats[otherId].unreadCount++;
      }
    }

    const chatList = Object.values(chats);
    res.status(200).json({ total: chatList.length, chats: chatList });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
