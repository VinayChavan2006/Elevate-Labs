import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setChat } from "../redux/features/chatSlice.js";
import { formatDate } from "../utils/formatDate.js";
import { useUpdateMessageStatusMutation } from "../redux/api/messageSlice.js";
import { Check, CheckCheck } from "lucide-react";
import { socket } from "../socket/socket.js";
import { useUpdateLastMessageMutation } from "../redux/api/chatSlice.js";

const ChatItem = ({ chat, onlineStatus }) => {
  const { userInfo } = useSelector((state) => state.auth);
  const [chatName, setChatName] = useState(chat.chatName);
  const [chatStatus, setChatStatus] = useState("offline");
  const [messageStatus, setMessageStatus] = useState("sent");

  useEffect(() => {
    console.log("here", onlineStatus);
    if (chat?.isGroupChat) {
      setChatName(chat.chatName);
    } else {
      setChatName(
        chat.chatName?.split("/")[0] == userInfo.name
          ? chat.chatName?.split("/")[1]
          : chat.chatName?.split("/")[0]
      );
    }
    const item = onlineStatus?.find((itm) => itm.chatId === chat?._id);
    if (item) {
      setChatStatus(item?.status);
    }
  }, [chatName, userInfo, onlineStatus]);
  // get current logged in user

  const dispatch = useDispatch();
  const handleChatWindow = () => {
    console.log(chat, chatStatus);
    dispatch(setChat({ ChatItem: chat, chatStatus }));
  };

  // update
  const [updateLastMessage] = useUpdateLastMessageMutation();
  const [updateMessageStatus] = useUpdateMessageStatusMutation();
  useEffect(() => {
    const updateLastMessageHandler = async (data) => {
      console.log("updating...");
      await updateLastMessage({
        messageId:
          data?.messageItem?._id == undefined ? null : data?.messageItem?._id,
        chatId: data?.chatId,
      });
    };
    socket.on("recieved-message", updateLastMessageHandler);
    socket.on("clear-chat", updateLastMessageHandler);

    return () => {
      socket.off("recieved-message", updateLastMessageHandler);
      socket.off("clear-chat", updateLastMessageHandler);
    };
  }, [socket, onlineStatus, userInfo]);

  useEffect(() => {}, [chat.lastMessage, chat?.lastMessage?.status]);

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
              ? chat.chatName?.split("/")[1]?.length > 20
                ? chat.chatName?.split("/")[1].slice(0, 20) + "..."
                : chat.chatName?.split("/")[1]
              : chat.chatName?.split("/")[0]?.length > 20
              ? chat.chatName?.split("/")[0].slice(0, 20) + "..."
              : chat.chatName?.split("/")[0]}
          </p>
          <p className="text-[0.7rem]">
            {chat.lastMessage ? formatDate(chat.lastMessage?.createdAt) : ""}
          </p>
        </div>
        <div className="flex justify-between">
          <div className="flex gap-1 items-center">
            {/* { chat.lastMessage?.message ? messageStatus === "sent" ? (
              <Check className="w-3 h-3" />
            ) : chat.lastMessage?.status === "delivered" ? (
              <CheckCheck className="w-3 h-3" />
            ) : (
              <CheckCheck className="w-3 h-3 text-teal-400" />
            ) : ''} */}
            <p className="text-[0.8rem]">
              {chat.lastMessage?.message?.length > 20
                ? chat.lastMessage?.message.slice(0, 20) + "..."
                : chat.lastMessage?.message}
            </p>
          </div>
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
