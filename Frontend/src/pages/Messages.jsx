import React, { useEffect, useState, useContext, useRef } from "react";
import { io } from "socket.io-client";
import API from "../api/api.js";
import { AuthContext } from "../context/AuthContext.jsx";
import { ArrowLeft, Send, Search } from "lucide-react";
import { useNavigate, useLocation, useSearchParams } from "react-router-dom";
import Avtar from "../assets/profile.png";

let socket;

const Messages = () => {
  const { user } = useContext(AuthContext);
  const [chats, setChats] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [content, setContent] = useState("");
  const bottomRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  const query = new URLSearchParams(location.search);
  const chatWith = query.get("chatWith");

  const [searchParams] = useSearchParams();
  const openChatWith = searchParams.get("chatWith");

  // Initialize socket only once
  useEffect(() => {
    if (!socket) {
      socket = io("http://localhost:5000", { withCredentials: true });
    }

    if (user?._id) {
      socket.emit("join", user._id);
    }

    return () => {
      if (socket) socket.off("receiveMessage");
    };
  }, [user]);

  // Auto-open chat from navigation
  useEffect(() => {
    if (chatWith && user?._id) {
      openChat(chatWith);
    }
  }, [chatWith, user?._id]);

  // Fetch chat list
  useEffect(() => {
    const fetchChats = async () => {
      try {
        const res = await API.get("/messages");
        setChats(res.data.chats || []);
      } catch (err) {
        console.error("Error fetching chats:", err);
      }
    };
    fetchChats();
  }, []);

  // Open chat with specific user
  const openChat = async (otherUserId) => {
    try {
      const res = await API.get(`/messages/${otherUserId}`);
      const msgs = res.data.messages || res.data || [];

      let otherUser = null;

      if (msgs.length > 0) {
        otherUser =
          msgs[0].from._id === user._id ? msgs[0].to : msgs[0].from;
      } else {
        const userRes = await API.get(`/auth/${otherUserId}`);
        otherUser =
          userRes.data.user || userRes.data || { _id: otherUserId, name: "Unknown" };
      }

      setSelectedChat(otherUser);
      setMessages(msgs);

      setChats((prev) =>
        prev.map((chat) =>
          chat.user._id === otherUserId ? { ...chat, unreadCount: 0 } : chat
        )
      );

      try {
        await API.put("/messages/mark-read", { from: otherUserId });
        socket.emit("markRead", { from: otherUserId, to: user._id });
      } catch (err) {
        console.warn("Mark-read failed:", err.message);
      }
    } catch (err) {
      console.error("Error loading chat:", err);
    }
  };

  // SOCKET: Handle real-time incoming messages
  useEffect(() => {
    if (!socket) return;

    const handleReceive = (msg) => {
      if (
        msg.from._id === selectedChat?._id ||
        msg.to._id === selectedChat?._id
      ) {
        setMessages((prev) => [...prev, msg]);
      }

      setChats((prev) => {
        const updated = [...prev];
        const existing = updated.find(
          (c) => c.user._id === msg.from._id || c.user._id === msg.to._id
        );

        if (existing) {
          existing.lastMessage = msg;
          if (msg.to._id === user._id) existing.unreadCount++;
        } else {
          const newUser = msg.from._id === user._id ? msg.to : msg.from;
          updated.unshift({
            user: newUser,
            lastMessage: msg,
            unreadCount: msg.to._id === user._id ? 1 : 0,
          });
        }
        return updated;
      });
    };

    socket.on("receiveMessage", handleReceive);
    return () => socket.off("receiveMessage", handleReceive);
  }, [selectedChat, user]);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Send message
  const handleSend = async () => {
    if (!content.trim() || !selectedChat) return;

    const newMsg = { from: user._id, to: selectedChat._id, content };

    try {
      setMessages((prev) => [...prev, { from: user, to: selectedChat, content }]);
      setContent("");

      socket.emit("sendMessage", newMsg);

      setChats((prev) => {
        const updated = [...prev];
        const existing = updated.find((c) => c.user._id === selectedChat._id);

        if (existing) {
          existing.lastMessage = newMsg;
        } else {
          updated.unshift({
            user: selectedChat,
            lastMessage: newMsg,
            unreadCount: 0,
          });
        }

        return updated;
      });
    } catch (err) {
      console.error("Send failed:", err);
    }
  };

  // Search Filter
  const filteredChats = chats.filter((chat) =>
    chat.user?.name?.toLowerCase().includes(search.toLowerCase())
  );

  // ❌ Removed broken block that caused your error
  // It used "conversations" which does NOT exist
  // And it blocked scrolling

  return (
    <div className="flex h-[90vh] w-full py-2.5">
      {/* LEFT SIDEBAR */}
      <div
        className={`${selectedChat ? "hidden md:flex" : "flex"
          } w-full md:w-[350px] bg-gray-50 rounded-lg flex-col transition-all m-3 mb-0 shadow mt-0`}
      >
        <div className="flex items-center gap-3 p-2">
          <button
            onClick={() => navigate("/client")}
            className="p-2 bg-gray-200 rounded-full hover:bg-gray-300"
          >
            <ArrowLeft size={18} />
          </button>
          <h2 className="text-lg font-semibold">All Messages</h2>
        </div>

        {/* Search */}
        <div className="flex items-center bg-gray-100 mx-3 my-2 px-3 rounded-full">
          <Search size={18} className="text-gray-500" />
          <input
            type="text"
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 bg-transparent px-2 py-2 text-sm outline-none"
          />
        </div>

        {/* Chat List */}
        <div className="flex-1 overflow-y-auto">
          {filteredChats.length === 0 ? (
            <p className="text-center text-gray-400 mt-10">
              No conversations yet
            </p>
          ) : (
            filteredChats.map(({ user: chatUser, lastMessage, unreadCount }) => (
              <div
                key={chatUser._id}
                onClick={() => openChat(chatUser._id)}
                className={`flex items-center gap-3 px-4 py-3 hover:bg-gray-100 cursor-pointer ${selectedChat?._id === chatUser._id ? "bg-gray-100" : ""
                  }`}
              >
                <img
                  src={chatUser?.profileImage?.url || Avtar}
                  className="w-10 h-10 rounded-full object-cover"
                  alt={chatUser?.name}
                />
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-800">
                    {chatUser?.name}
                  </h3>
                  <p className="text-sm text-gray-500 truncate">
                    {lastMessage?.content || "Start conversation"}
                  </p>
                </div>
                {unreadCount > 0 && (
                  <span className="text-xs bg-red-500 text-white px-2 py-1 rounded-full">
                    {unreadCount}
                  </span>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      {/* RIGHT CHAT */}
      <div
        className={`${selectedChat ? "flex" : "hidden md:flex"
          } flex-1 flex-col transition-all bg-gray-50 rounded-lg mx-3 shadow`}
      >
        {!selectedChat ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-400">
            <p>Select a chat to start messaging</p>
          </div>
        ) : (
          <>
            {/* HEADER */}
            <div className="flex items-center gap-3 bg-white px-4 py-3 shadow rounded-t-lg">
              <button
                onClick={() => setSelectedChat(null)}
                className="p-1 md:hidden"
              >
                <ArrowLeft size={22} />
              </button>
              <img
                src={selectedChat?.profileImage?.url || Avtar}
                className="w-9 h-9 rounded-full"
                alt={selectedChat?.name}
              />
              <div>
                <h2 className="font-semibold text-gray-900">
                  {selectedChat?.name}
                </h2>
                <p className="text-xs text-gray-500">Active now</p>
              </div>
            </div>

            {/* MESSAGES */}
            <div className="flex-1 overflow-y-auto px-4 py-3 space-y-2 bg-gray-50">
              {messages.length === 0 && (
                <p className="text-center text-gray-400 mt-5">
                  🗨️ Start a conversation
                </p>
              )}

              {messages.map((msg, idx) => (
                <div
                  key={msg._id || idx}
                  className={`flex ${msg.from._id === user._id
                    ? "justify-end"
                    : "justify-start"
                    }`}
                >
                  <div
                    className={`px-4 py-2 rounded-2xl max-w-[70%] ${msg.from._id === user._id
                      ? "bg-green-500 text-white"
                      : "bg-gray-200 text-gray-800"
                      }`}
                  >
                    {msg.content}
                  </div>
                </div>
              ))}

              <div ref={bottomRef} />
            </div>

            {/* INPUT */}
            <div className="flex items-center gap-2 px-3 py-2 bg-white border-t rounded-b-lg">
              <input
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Type a message..."
                className="flex-1 px-4 py-2 rounded-full bg-gray-100 outline-none"
              />
              <button
                onClick={handleSend}
                className="bg-green-500 text-white rounded-full p-2 hover:bg-green-600"
              >
                <Send size={18} />
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Messages;
