import Message from "../models/Message.js";
import User from "../models/User.js";
import Client from "../models/Client.js";
import Freelancer from "../models/Freelancer.js";


// Helper to fetch user details
const getUserWithProfile = async (userId) => {
  const user = await User.findById(userId).select("name email");

  if (!user) return null;

  // Check Client
  const client = await Client.findOne({ user: userId }).select("profileImage");
  if (client) {
    return {
      _id: user._id,
      name: user.name,
      profileImage: client.profileImage || null,
    };
  }

  // Check Freelancer
  const freelancer = await Freelancer.findOne({ user: userId }).select("profileImage");
  if (freelancer) {
    return {
      _id: user._id,
      name: user.name,
      profileImage: freelancer.profileImage || null,
    };
  }

  return {
    _id: user._id,
    name: user.name,
    profileImage: null,
  };
};



// SEND MESSAGE
export const sendMessage = async (req, res) => {
  try {
    const { to, content } = req.body;
    const from = req.user.id;

    if (!to || !content)
      return res.status(400).json({ message: "Recipient and content are required" });

    const message = await Message.create({ from, to, content });

    // Fetch full profile for both users
    const fromUser = await getUserWithProfile(from);
    const toUser = await getUserWithProfile(to);

    const populatedMsg = {
      ...message._doc,
      from: fromUser,
      to: toUser,
    };

    res.status(201).json({ message: "Message sent", data: populatedMsg });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


// GET FULL CONVERSATION
export const getConversation = async (req, res) => {
  try {
    const userId = req.user.id;
    const { otherUserId } = req.params;

    const messages = await Message.find({
      $or: [
        { from: userId, to: otherUserId },
        { from: otherUserId, to: userId },
      ],
    }).sort({ createdAt: 1 });

    const finalMessages = [];
    for (const msg of messages) {
      const fromUser = await getUserWithProfile(msg.from);
      const toUser = await getUserWithProfile(msg.to);

      finalMessages.push({
        ...msg._doc,
        from: fromUser,
        to: toUser,
      });
    }

    res.status(200).json({ total: finalMessages.length, messages: finalMessages });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


// MARK AS READ
export const markAsRead = async (req, res) => {
  try {
    const userId = req.user.id;
    const { from } = req.body;

    const result = await Message.updateMany(
      { from, to: userId, read: false },
      { $set: { read: true } }
    );

    res.status(200).json({
      message: "Messages marked as read",
      updated: result.modifiedCount,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


// GET CHATS SUMMARY 
export const getChatsSummary = async (req, res) => {
  try {
    const userId = req.user.id;

    const messages = await Message.find({
      $or: [{ from: userId }, { to: userId }],
    }).sort({ createdAt: -1 });

    const chats = {};

    for (const msg of messages) {
      const otherUserId =
        msg.from.toString() === userId.toString() ? msg.to : msg.from;

      if (!chats[otherUserId]) {
        const otherUserProfile = await getUserWithProfile(otherUserId);

        chats[otherUserId] = {
          user: otherUserProfile,
          lastMessage: msg,
          unreadCount: 0,
        };
      }

      if (msg.to.toString() === userId.toString() && !msg.read) {
        chats[otherUserId].unreadCount++;
      }
    }

    const chatList = Object.values(chats);

    res.status(200).json({ total: chatList.length, chats: chatList });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
