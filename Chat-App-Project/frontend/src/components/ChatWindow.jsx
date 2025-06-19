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
  useGetAllMessagesQuery,
  useSendMessageMutation,
} from "../redux/api/messageSlice.js";
import { toast } from "react-toastify";
import { socket } from "../socket/socket.js";

const ChatWindow = () => {
  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [recieverName, setRecieverName] = useState(selectedChat?.chatName);
  const [chatStatus,setChatStatus] = useState('offline')
  const [recievers, setRecievers] = useState([])

  const { userInfo } = useSelector((state) => state.auth);
  const { chatItem } = useSelector((state) => state.chat);


  // set the selected chat from the chatItem in the Redux store
  useEffect(() => {
    if (chatItem) setSelectedChat(chatItem);
    setRecievers(chatItem?.members?.filter(member => member !== userInfo?._id))
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
  }, [userInfo,selectedChat]);

  const [showOptions, setShowOptions] = useState(false);

  const messageRef = useRef();

  // redux rtk query for send Message
  const [sendMessage, { isLoading: isSending, error: sendError }] =
    useSendMessageMutation();

  const handleSendMessage = async () => {
    if (messageRef.current.value.trim() === "") return;
    console.log(messageRef.current.value);

    const newMsg = {
      message: messageRef.current.value,
      sender: userInfo?._id,
      reciever: selectedChat?._id,
    };
    try {
      // Call the sendMessage API
      await sendMessage({
        chatId: selectedChat._id,
        message: messageRef.current.value,
      });
    } catch (error) {
      toast.error(error?.data?.message || "Failed to send message");
    }
    messageRef.current.value = "";
  };
  const bottomRef = useRef();
  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behaviour: "smooth",
    });
  }, [messages]);
  const handleDeleteChat = async () => {};
  const handleClearChatMessages = async () => {};

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
                onClick={() => {
                  handleDeleteChat;
                }}
                className="flex items-center w-full px-4 py-2 text-black hover:bg-blue-500 hover:text-sm"
              >
                <Trash2 size={16} className="mr-2" /> Delete Chat
              </button>
              <button
                onClick={() => {
                  handleClearChatMessages;
                }}
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
              ref={messageRef}
              onKeyPress={(e) => {
                if (e.key === "Enter") handleSendMessage();
              }}
            />
            <button className="text-gray-500 hover:text-gray-800 p-2 rounded-full transition-colors">
              <Smile size={20} />
            </button>
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
