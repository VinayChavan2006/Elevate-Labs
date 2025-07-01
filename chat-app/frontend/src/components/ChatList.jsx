import React, { useEffect, useState } from "react";
import ChatItem from "./ChatItem";
import { PlusCircle, Search } from "lucide-react";
import { useSelector } from "react-redux";
import { socket } from "../socket/socket.js";

const ChatList = ({ setIsPopupOpen, data, isLoading, error, onlineStatus }) => {
  const [chats, setChats] = useState([]);
  const [filteredChats, setFilteredChats] = useState([]);
  
  // get user info from redux store
  const { userInfo } = useSelector((state) => state.auth);
  console.log(onlineStatus);

  useEffect(() => {
    setChats(data);
    setFilteredChats(data);
  }, [data, isLoading, chats, filteredChats, onlineStatus]);

  // filter chats based on search input
  const filterChats = (searchString) => {
    const filtered = chats.filter((chat) =>
      chat?.chatName?.toLowerCase().includes(searchString.toLowerCase())
    );
    console.log(filtered);
    setFilteredChats(filtered);
  };

  // join room for all chats
  useEffect(() => {
    if (!data) return;
    data.map((chat) => {
      socket.emit("join-room", chat?._id);
    });
  }, [data, chats, onlineStatus, userInfo]);


  return (
    <div className="w-2/5 h-screen bg-white shadow p-4">
      <div className="flex justify-between">
        <p className="text-2xl">Chats</p>
        <button
          onClick={() => setIsPopupOpen(true)}
          className="flex gap-1.5 items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-full transition-colors duration-200 shadow-md"
        >
          <PlusCircle /> Create New Chat
        </button>
      </div>
      <div className="w-full mt-3 flex items-center bg-gray-100 rounded-full py-2 px-4 shadow-inner">
        <Search />
        <input
          type="text"
          name="search"
          id="search"
          placeholder="Search"
          className="rounded-md w-full h-full p-2"
          onChange={(e) => filterChats(e.target.value)}
        />
      </div>
      {isLoading ? (
        <div className="flex justify-center items-center h-[calc(100vh-120px)]">
          <p className="text-gray-500 text-lg">Loading...</p>
        </div>
      ) : error ? (
        <div className="flex justify-center items-center h-[calc(100vh-120px)]">
          <p className="text-red-500 text-lg">Error loading chats</p>
        </div>
      ) : (
        <div className="h-[calc(100vh-120px)] overflow-auto scroll">
          {filteredChats && filteredChats?.length ? (
            filteredChats.map((chat) => (
              <ChatItem
                chat={chat}
                onlineStatus={onlineStatus}
                key={chat?._id}
              />
            ))
          ) : (
            <h1 className="text-center mt-6 text-2xl text-shadow-black font-bold">
              No chats
            </h1>
          )}
        </div>
      )}
    </div>
  );
};

export default ChatList;
