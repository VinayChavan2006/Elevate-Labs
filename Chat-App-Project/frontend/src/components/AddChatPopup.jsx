import React, { useEffect, useState } from "react";
import { Search, X } from "lucide-react"; // Import icons
import ChatItem from "./ChatItem"; // Re-use your existing ChatItem component
import { useGetAllUsersQuery } from "../redux/api/userSlice.js";
import {
  useCreateGroupChatMutation,
  useCreatePrivateChatMutation,
} from "../redux/api/chatSlice.js";
import { toast } from "react-toastify";

const AddChatPopup = ({ isOpen, onClose }) => {
  const [allAvailableChats, setAllAvailableChats] = useState([]);
  const [isGroupChat, setIsGroupChat] = useState(false); // Toggle state
  const [chatName, setChatName] = useState();
  const [filteredChats, setFilteredChats] = useState();

  if (!isOpen) return null;

  // get users list
  const { data, isLoading, error } = useGetAllUsersQuery();
  useEffect(() => {
    if(error){
      toast.error(
        error?.data?.message || "Failed to fetch users"
      );
    }
    setAllAvailableChats(data);
    filterChats("");
  }, [data, isLoading, allAvailableChats]);

  function filterChats(searchQuery) {
    // Filter chats based on search query
    const filtered = allAvailableChats?.filter((chat) => {
      const matchesSearch = chat.email
        .toLowerCase()
        .trim()
        .includes(searchQuery);
      return matchesSearch;
    });
    setFilteredChats(filtered);
    return filtered;
  }

  const [selectedChats, setSelectedChats] = useState([]);

  const handleSelect = (chatId) => {
    setSelectedChats((prev) =>
      prev.includes(chatId)
        ? prev.filter((id) => id !== chatId)
        : [...prev, chatId]
    );
    console.log(selectedChats);
  };

  // add new chat
  const [createPrivateChat] = useCreatePrivateChatMutation();
  const [createGroupChat] = useCreateGroupChatMutation();
  const handleAddNewChat = async () => {
    if (isGroupChat) {
      if (!chatName) {
        toast.info("Please enter a group chat name");
        return;
      }
      const res = await createGroupChat({
        chatName,
        members: selectedChats,
      });
      
      if (res?.error) {
        toast.error(
          res?.error?.data?.message || "Failed to create group chat"
        );
        return;
      }
      toast.success("Group chat created successfully");
      setChatName("");
      setSelectedChats([]);
      onClose()
    } else {
      if (selectedChats.length > 1) {
        toast.info("Please select only one user for a private chat");
        return;
      } else {
        const response = await createPrivateChat({
          recieverId: selectedChats[0],
        });
        if (response?.error) {
          toast.error(
            response?.error?.data?.message || "Failed to create private chat"
          );
          return;
        }
        toast.success("Private chat created successfully");
        setSelectedChats([]);
        setChatName("");
        onClose()
      }
    }
  };

  return (
    // Overlay for the popup
    <div className="fixed inset-0 bg-transparent bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg p-6 relative animate-fade-in-up">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 transition-colors p-1 rounded-full hover:bg-gray-100"
          aria-label="Close popup"
        >
          <X size={24} />
        </button>

        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          Start New Chat
        </h2>

        {/* Search Bar */}
        <div className="relative mb-4">
          <div className="flex items-center bg-gray-100 rounded-full py-2 px-4 shadow-inner">
            <Search size={18} className="text-gray-500 mr-2" />
            <input
              type="text"
              placeholder="Search for people..."
              className="flex-grow bg-transparent outline-none text-gray-800 placeholder-gray-500 text-base"
              onChange={(e) => filterChats(e.target.value)}
            />
          </div>
        </div>

        {/* Toggle Button for isGroupChat */}
        <div className="mb-4 flex justify-between">
          <button
            onClick={() => setIsGroupChat(!isGroupChat)}
            className={`flex ml-2 items-center p-2 rounded-full transition-colors duration-300 ease-in-out ${
              isGroupChat
                ? "bg-blue-600 text-white shadow-md"
                : "bg-gray-200 text-gray-700"
            }`}
            aria-pressed={isGroupChat}
          >
            <span className="font-medium text-sm mr-2">Create Group Chat</span>
            {/* Simple Toggle */}
            <div
              className={`w-10 h-5 rounded-full relative ${
                isGroupChat ? "bg-blue-300" : "bg-gray-400"
              }`}
            >
              <div
                className={`absolute left-0 top-0.5 w-4 h-4 rounded-full bg-white transition-transform duration-300 ease-in-out ${
                  isGroupChat ? "translate-x-full ml-0.5" : "ml-0.5"
                }`}
              ></div>
            </div>
          </button>
          <button
            onClick={handleAddNewChat}
            className="mr-2 flex items-center p-2 rounded-full transition-colors duration-300 ease-in-out bg-blue-600 text-white shadow-md"
          >
            Create
          </button>
        </div>
        {isGroupChat && (
          <div className="flex items-center bg-gray-100 rounded-full py-1.5 px-4 shadow-inner">
            <input
              type="text"
              placeholder="Enter Group Chat Name..."
              className="flex-grow bg-transparent outline-none text-gray-800 placeholder-gray-500 text-base"
              onChange={(e) => setChatName(e.target.value)}
            />
          </div>
        )}

        {/* List of Chats */}
        <div className="max-h-80 overflow-y-auto scrollbar-thin rounded-lg border border-gray-200">
          {filteredChats?.length > 0 ? (
            filteredChats.map((chat) => (
              <div
                key={chat._id}
                className={`flex gap-2 shadow rounded-sm mt-3 p-2 hover:cursor-pointer hover:scale-[1.05] ease-in-out m-1 ${
                  selectedChats.includes(chat._id) ? "bg-blue-600" : ""
                }`}
                onClick={() => handleSelect(chat._id)}
              >
                <div className="w-16 h-16 rounded-full">
                  <img src={`${chat.profileImage}`} alt="" />
                </div>
                <div className="flex flex-col w-full">
                  <div className="w-full flex justify-between">
                    <p>{chat.name}</p>
                  </div>
                  <p>{chat.email}</p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500 py-6">No chats found.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddChatPopup;
