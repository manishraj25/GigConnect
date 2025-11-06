import React, { useEffect, useState, useContext, useRef } from "react";
import { io } from "socket.io-client";
import API from "../api/api.js";
import { AuthContext } from "../context/AuthContext.jsx";
import { ArrowLeft, Send, Search } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

const socket = io("http://localhost:5000", { withCredentials: true });

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


    useEffect(() => {
        if (chatWith && user) {
            openChat(chatWith);
        }
    }, [chatWith, user]);


    useEffect(() => {
        if (user?._id) socket.emit("join", user._id);
    }, [user]);

    // Fetch chat summaries
    useEffect(() => {
        const fetchChats = async () => {
            try {
                const res = await API.get("/messages");
                setChats(res.data.chats);
            } catch (err) {
                console.error("Error fetching chats:", err);
            }
        };
        fetchChats();
    }, []);

    const openChat = async (otherUserId) => {
        try {
            const res = await API.get(`/messages/${otherUserId}`);
            setMessages(res.data.messages);
            const otherUser =
                res.data.messages[0]?.from._id === user._id
                    ? res.data.messages[0]?.to
                    : res.data.messages[0]?.from;
            setSelectedChat(otherUser);
            await API.put("/messages/mark-read", { from: otherUserId });
            socket.emit("markRead", { from: otherUserId, to: user._id });

            // Reset unread count for that chat
            setChats((prev) =>
                prev.map((chat) =>
                    chat.user._id === otherUserId
                        ? { ...chat, unreadCount: 0 }
                        : chat
                )
            );
        } catch (err) {
            console.error("Error loading conversation:", err);
        }
    };

    useEffect(() => {
        socket.on("receiveMessage", (msg) => {
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
                    // new chat (first message)
                    const newUser =
                        msg.from._id === user._id ? msg.to : msg.from;
                    updated.unshift({
                        user: newUser,
                        lastMessage: msg,
                        unreadCount: msg.to._id === user._id ? 1 : 0,
                    });
                }

                return updated;
            });
        });

        return () => socket.off("receiveMessage");
    }, [selectedChat, user]);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleSend = async () => {
        if (!content.trim() || !selectedChat) return;
        const newMsg = { from: user._id, to: selectedChat._id, content };

        try {
            setMessages((prev) => [
                ...prev,
                { from: user, to: selectedChat, content },
            ]);
            setContent("");
            socket.emit("sendMessage", newMsg);
            await API.post("/messages", newMsg);
        } catch (err) {
            console.error("Send failed:", err);
        }
    };

    const filteredChats = chats.filter((chat) =>
        chat.user.name.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="flex h-[90vh] w-full">
            {/* LEFT SIDEBAR */}
            <div
                className={`${selectedChat ? "hidden md:flex" : "flex"
                    } w-full md:w-[350px] bg-gray-50 rounded-lg flex-col transition-all m-3 shadow mt-0`}
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

                {/* Search bar */}
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

                {/* Chat list */}
                <div className="flex-1 overflow-y-auto">
                    {filteredChats.length === 0 ? (
                        <p className="text-center text-gray-400 mt-10">
                            No conversations
                        </p>
                    ) : (
                        filteredChats.map(
                            ({ user: chatUser, lastMessage, unreadCount }) => (
                                <div
                                    key={chatUser._id}
                                    onClick={() => openChat(chatUser._id)}
                                    className={`flex items-center gap-3 px-4 py-3 hover:bg-gray-100 cursor-pointer ${selectedChat?._id === chatUser._id ? "bg-gray-100" : ""
                                        }`}
                                >
                                    <img
                                        src={
                                            chatUser?.profileImage?.url ||
                                            "/default-avatar.png"
                                        }
                                        className="w-10 h-10 rounded-full object-cover"
                                    />
                                    <div className="flex-1">
                                        <h3 className="font-semibold text-gray-800">
                                            {chatUser?.name}
                                        </h3>
                                        <p className="text-sm text-gray-500 truncate">
                                            {lastMessage?.content}
                                        </p>
                                    </div>
                                    {unreadCount > 0 && (
                                        <span className="text-xs bg-red-500 text-white px-2 py-1 rounded-full">
                                            {unreadCount}
                                        </span>
                                    )}
                                </div>
                            )
                        )
                    )}
                </div>
            </div>

            {/* RIGHT CHAT AREA */}
            <div
                className={`${selectedChat ? "flex" : "hidden md:flex"
                    } flex-1 flex-col transition-all bg-gray-50 rounded-lg m-3 mt-0 shadow`}
            >
                {!selectedChat ? (
                    <div className="flex flex-col items-center justify-center h-full text-gray-400">
                        <p>Select a chat to start messaging</p>
                    </div>
                ) : (
                    <>
                        {/* HEADER */}
                        <div className="flex items-center gap-3 bg-white px-4 py-3 shadow">
                            <button
                                onClick={() => setSelectedChat(null)}
                                className="p-1 md:hidden"
                            >
                                <ArrowLeft size={22} />
                            </button>
                            <img
                                src={
                                    selectedChat?.profileImage?.url ||
                                    "/default-avatar.png"
                                }
                                className="w-9 h-9 rounded-full"
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
                            {messages.map((msg, idx) => (
                                <div
                                    key={idx}
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
                        <div className="flex items-center gap-2 px-3 py-2 bg-white border-t">
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
