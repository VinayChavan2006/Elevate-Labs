import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setChat } from "../redux/features/chatSlice.js";
import { formatDate } from "../utils/formatDate.js";

const ChatItem = ({ chat, onlineStatus }) => {
  const { userInfo } = useSelector((state) => state.auth);
  const [chatName, setChatName] = useState(chat.chatName);
  const [chatStatus, setChatStatus] = useState('offline')

  useEffect(() => {
    console.log('here',onlineStatus)
    if (chat?.isGroupChat) {
      setChatName(chat.chatName);
    } else {
      setChatName(
        chat.chatName?.split("/")[0] == userInfo.name
          ? chat.chatName?.split("/")[1]
          : chat.chatName?.split("/")[0]
      );
    }
    const item = onlineStatus?.find(itm => itm.chatId === chat?._id)
    if(item){
      setChatStatus(item?.status)
    }
  }, [chatName, userInfo, onlineStatus]);
  // get current logged in user

  const dispatch = useDispatch();
  const handleChatWindow = () => {
    dispatch(setChat(chat));
  };

  return (
    <div
      onClick={handleChatWindow}
      className="flex gap-2 shadow rounded-sm mt-3 p-2 hover:cursor-pointer hover:scale-[1.05] ease-in-out m-1"
    >
      <div className="w-16 h-16 rounded-full">
        <img src={`${chat.chatProfileImage}`} alt="" />
      </div>
      <div className="flex flex-col w-full">
        <div className="w-full flex justify-between">
          <p>
            {chat.chatName?.split("/")[0] == userInfo.name
              ? chat.chatName?.split("/")[1]
              : chat.chatName?.split("/")[0]}
          </p>
          <p className="text-[0.7rem]">{chat.lastMessage ? formatDate(chat.lastMessage?.createdAt) : ''}</p>
        </div>
        <div className="flex justify-between">
          <p className="text-[0.8rem]">{chat.lastMessage?.message}</p>
          {chat.unreadMessageCount > 0 ? (
            <div className="w-5 h-5 rounded-full bg-red-500 text-white flex justify-center items-center text-[0.7rem]">
              {chat.unreadMessageCount}
            </div>
          ) : (
            <div></div>
          )}
          <span className="text-[0.7rem]">{chatStatus}</span>
        </div>
      </div>
    </div>
  );
};

export default ChatItem;
