import React, { useEffect, useRef, useState } from "react";
import {
  Paperclip,
  Mic,
  Send,
  Smile,
  Phone,
  Video,
  MoreVertical,
  Trash2,
  ClipboardCopy,
} from "lucide-react"; // Import necessary icons
import ChatBubble from "./ChatBubble";
import { useSelector } from "react-redux";
import {
  useDeleteChatMessagesMutation,
  useGetAllMessagesQuery,
  useSendMessageMutation,
} from "../redux/api/messageSlice.js";
import { toast } from "react-toastify";
import { socket } from "../socket/socket.js";
import {
  useDeleteGroupChatMutation,
  useDeletePrivateChatMutation,
} from "../redux/api/chatSlice.js";
import Picker from "@emoji-mart/react";
import emojiData from "@emoji-mart/data"; // Import emoji data

const ChatWindow = () => {
  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [recieverName, setRecieverName] = useState(selectedChat?.chatName);
  const [chatStatus, setChatStatus] = useState("offline");
  const [recievers, setRecievers] = useState([]);
  const [messageInput, setMessageInput] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const { userInfo } = useSelector((state) => state.auth);
  const { chatItem, chatStatus: status } = useSelector((state) => state.chat);

  // set the selected chat from the chatItem in the Redux store
  useEffect(() => {
    console.log(chatItem, status);
    if (chatItem) {
      setSelectedChat(chatItem);
      setChatStatus(status);
    }
    setRecievers(
      chatItem?.members?.filter((member) => member !== userInfo?._id)
    );
  }, [chatItem]);

  // get chat messages if chat  is selected
  const {
    data,
    isLoading: isMessagesLoading,
    error: messagesError,
  } = useGetAllMessagesQuery(
    { chatId: selectedChat?._id },
    { skip: !selectedChat }
  );

  // handle message error and set messages
  useEffect(() => {
    if (messagesError) {
      toast.error(messagesError?.data?.message || "Failed to fetch messages");
    }
    if (data) {
      setMessages(data);
    }
  }, [messagesError, data]);

  // set Reciever name based on chat
  useEffect(() => {
    if (selectedChat) {
      if (selectedChat?.isGroupChat) {
        setRecieverName(selectedChat?.chatName);
      } else {
        setRecieverName(
          selectedChat.chatName?.split("/")[0] == userInfo.name
            ? selectedChat.chatName?.split("/")[1]
            : selectedChat.chatName?.split("/")[0]
        );
      }
    }
  }, [selectedChat]);

  // set user status
  useEffect(() => {
    if (!userInfo?._id || !selectedChat?._id) return;

    socket.emit("join-room", selectedChat?._id);

    const messageHandler = (data) => {
      setMessages((prevMessages) => {
        let alreadyExists = prevMessages.some(
          (msg) => msg?._id == data?.messageItem?._id
        );
        if (alreadyExists) return prevMessages;
        return [...prevMessages, data?.messageItem];
      });
    };
    socket.on("recieved-message", messageHandler);

    return () => {
      socket.off("recieved-message", messageHandler);
    };
  }, [userInfo, selectedChat]);

  const typingTimeout = useRef(null);

  const handleTyping = (e) => {
    setMessageInput(e.target.value);
    socket.emit("typing", selectedChat?._id); // Emit to backend

    clearTimeout(typingTimeout.current);
    typingTimeout.current = setTimeout(() => {
      socket.emit("stop-typing", selectedChat?._id);
    }, 1000); // 2 sec after typing stops
  };

  useEffect(() => {
    socket.on("typing", (chatId) => {
      if (chatId === selectedChat._id) {
        setChatStatus("typing...");
      }
    });

    socket.on("stop-typing", (chatId) => {
      if (chatId === selectedChat._id) {
        setChatStatus("online");
      }
    });

    return () => {
      socket.off("typing");
      socket.off("stop-typing");
    };
  }, [selectedChat]);

  const [showOptions, setShowOptions] = useState(false);

  // redux rtk query for send Message
  const [sendMessage, { isLoading: isSending, error: sendError }] =
    useSendMessageMutation();

  const handleSendMessage = async () => {
    if (messageInput.trim() === "") return;
    console.log(messageInput);

    const newMsg = {
      message: messageInput,
      sender: userInfo?._id,
      reciever: selectedChat?._id,
    };
    try {
      // Call the sendMessage API
      await sendMessage({
        chatId: selectedChat._id,
        message: messageInput,
      });
    } catch (error) {
      toast.error(error?.data?.message || "Failed to send message");
    }
    setMessageInput(""); // Clear input after sending
    setShowEmojiPicker(false); // Hide emoji picker after sending message
  };
  const bottomRef = useRef();
  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behaviour: "smooth",
    });
  }, [messages]);

  // delete chat rtk query
  const [deletePrivateChat] = useDeletePrivateChatMutation();
  const [deleteGroupChat] = useDeleteGroupChatMutation();
  const handleDeleteChat = async () => {
    if (selectedChat?.isGroupChat) {
      let res = await deleteGroupChat({ chatId: selectedChat?._id });
      if (res.data?.success) {
        toast.success(res.data?.message);
      } else {
        toast.error(res.data?.message);
      }
      setSelectedChat(null);
    } else {
      let res = await deletePrivateChat({ chatId: selectedChat?._id });
      if (res.data?.success) {
        toast.success(res.data?.message);
      } else {
        toast.error(res.data?.message);
      }
      setSelectedChat(null);
    }
  };

  // clear chat
  const [deleteChatMessages] = useDeleteChatMessagesMutation();
  const handleClearChatMessages = async () => {
    let res = await deleteChatMessages({ chatId: selectedChat?._id });
    if (res.data?.success) {
      toast.success(res.data?.message);
    } else {
      toast.error(res.data?.message);
    }
    setMessages([]);
  };

  // handle emojis in the chat
  const handleEmojiClick = (emoji) => {
    setMessageInput((prev) => prev + emoji.native);
  };
  const emojiPickerRef = useRef(null);
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        emojiPickerRef.current &&
        !emojiPickerRef.current.contains(event.target)
      ) {
        setShowEmojiPicker(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="flex-grow h-100vh">
      {!selectedChat ? (
        <div className="h-full flex justify-center items-center">
          <p>Select a Chat to start messaging</p>
        </div>
      ) : (
        <>
          <div className="flex h-[10%] bg-gray-50 rounded-xl shadow-lg relative overflow-hidden justify-between items-center p-5">
            <div className="flex gap-3.5 items-center">
              <div className="h-10 w-10">
                <img src={`${selectedChat?.chatProfileImage}`} alt="Person" />
              </div>
              <div>
                <p className="font-semibold">{recieverName}</p>
                <p className="text-[0.7rem]">{chatStatus}</p>
              </div>
            </div>
            <div className="flex gap-1.5 items-center">
              <button
                className="rounded-full hover:bg-gray-300 p-2"
                onClick={() => {
                  setShowOptions(!showOptions);
                  console.log(showOptions);
                }}
              >
                <MoreVertical />
              </button>
            </div>
          </div>
          {showOptions && (
            <div className="absolute top-10 right-0 mt-2 w-48 bg-white rounded-lg shadow-xl py-1 z-20">
              <button
                onClick={handleDeleteChat}
                className="flex items-center w-full px-4 py-2 text-black hover:bg-blue-500 hover:text-sm"
              >
                <Trash2 size={16} className="mr-2" /> Delete Chat
              </button>
              <button
                onClick={handleClearChatMessages}
                className="flex items-center w-full px-4 py-2 text-gray-700 hover:bg-blue-500 hover:text-gray-900 transition-colors text-sm"
              >
                <Trash2 size={16} className="mr-2" /> Clear Messages
              </button>
            </div>
          )}
          <div className="h-[80vh] flex-grow p-6 overflow-y-auto flex flex-col space-y-4 scrollbar-thin">
            {messages.length ? (
              messages.map((msg) => <ChatBubble key={msg._id} {...msg} />)
            ) : (
              <h1 className="text-center mt-6 font-semibold">
                {" "}
                No Messages yet
              </h1>
            )}
            <div ref={bottomRef}></div>
          </div>

          <div className="h-[10%] flex items-center p-4 bg-white border-t border-gray-200 shadow-sm">
            <button className="text-gray-500 hover:text-gray-800 p-2 rounded-full transition-colors">
              <Paperclip size={20} />
            </button>
            <input
              type="text"
              placeholder="Type a message here"
              className="flex-grow mx-3 px-4 py-2 bg-gray-100 rounded-full outline-none text-gray-800 placeholder-gray-500 text-sm focus:bg-white focus:ring-2 focus:ring-blue-200 transition-all duration-200"
              onChange={handleTyping}
              value={messageInput}
              onKeyPress={(e) => {
                if (e.key === "Enter") handleSendMessage();
              }}
            />
            <button
              className="text-gray-500 hover:text-gray-800 p-2 rounded-full transition-colors"
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            >
              <Smile size={20} />
            </button>
            {showEmojiPicker && (
              <div
                ref={emojiPickerRef}
                className="absolute bottom-full right-4 z-10 mb-2"
              >
                <Picker
                  data={emojiData}
                  onEmojiSelect={handleEmojiClick}
                  theme="light" // Or "dark", "auto"
                  perLine={9} // Number of emojis per line
                  emojiSize={24}
                  emojiButtonSize={32}
                  maxFrequentRows={1} // Show 1 row of frequently used emojis
                />
              </div>
            )}
            <button
              onClick={handleSendMessage}
              className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-full flex items-center justify-center ml-3 transition-colors shadow"
            >
              <Send size={20} />
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default ChatWindow;
