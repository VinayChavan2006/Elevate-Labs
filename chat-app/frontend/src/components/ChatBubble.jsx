import React, { useState } from "react";
import { useSelector } from "react-redux";
import { formatDate } from "../utils/formatDate.js";
import { useGetProfileQuery } from "../redux/api/userSlice.js";

const ChatBubble = ({ message, sender, createdAt }) => {
  const { userInfo } = useSelector((state) => state.auth);
  const {
    data: userData,
    isLoading,
    error,
  } = useGetProfileQuery({ userId: sender });
  // console.log(userData);
  const isMe = sender == userInfo?._id;
  return (
    <div
      className={`max-w-[60%] p-3 rounded-xl shadow ${
        isMe
          ? "bg-blue-600 self-end text-white rounded-br-md"
          : "bg-white self-start text-gray-800 rounded-bl-md"
      }`}
    >
      {userData && ( 
        <span
          className={`block text-xs font-semibold mb-1 ${
            isMe ? "text-blue-100" : "text-blue-600"
          }`}
        >
          {isLoading ? "..." : userData?.name}
        </span>
      )}
      <p className="text-sm leading-normal">{message}</p>
      <span
        className={`text-[0.6rem] mt-1 block text-right ${
          isMe ? "text-blue-200" : "text-gray-500"
        }`}
      >
        {formatDate(createdAt)}
      </span>
    </div>
  );
};

export default ChatBubble;
