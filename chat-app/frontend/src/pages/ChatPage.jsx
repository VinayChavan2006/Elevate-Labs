import React, { useState } from "react";
import SideBar from "../components/SideBar";
import ChatList from "../components/ChatList";
import ChatWindow from "../components/ChatWindow";
import AddChatPopup from "../components/AddChatPopup";
import { useEffect } from "react";
import { socket } from "../socket/socket.js";
import { useGetUserChatsQuery } from "../redux/api/chatSlice.js";
import { useSelector } from "react-redux";

const ChatPage = () => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [onlineStatus, setOnlineStatus] = useState([]);
  const { userInfo } = useSelector((state) => state.auth);
  const { data, isLoading, error } = useGetUserChatsQuery({
    userId: userInfo?._id,
  });

  useEffect(() => {
    socket.emit("setup", userInfo?._id);

    const statusUpdateHandler = ({ onlineUsers }) => {
      if (!data) return; // still prevent errors
      const updatedStatuses = data.map((chat) => {
        const isOnline = chat.members.some(
          (m) => onlineUsers.includes(m) && m !== userInfo._id
        );
        return { chatId: chat._id, status: isOnline ? "online" : "offline" };
      });

      setOnlineStatus(updatedStatuses);
      console.log('setStatus', updatedStatuses)
    };

    socket.on("user-status-change", statusUpdateHandler);

    return () => {
      socket.off("user-status-change", statusUpdateHandler);
    };
  }, [userInfo, data]); // KEEP this here

  return !isPopupOpen ? (
    <div className="flex">
      <SideBar />
      <ChatList
        setIsPopupOpen={setIsPopupOpen}
        data={data}
        isLoading={isLoading}
        error={error}
        onlineStatus={onlineStatus}
      />
      <ChatWindow />
    </div>
  ) : (
    <>
      <div className="flex blur-[5px] relative">
        <SideBar />
        <ChatList setIsPopupOpen={setIsPopupOpen} />
        <ChatWindow />
      </div>
      <AddChatPopup
        isOpen={isPopupOpen}
        onClose={() => setIsPopupOpen(false)}
      />
    </>
  );
};

export default ChatPage;
