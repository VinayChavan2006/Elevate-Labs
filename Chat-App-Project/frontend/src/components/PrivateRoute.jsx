import React from "react";
import { useState } from "react";
import { useSelector } from "react-redux";
import { Outlet, Navigate } from "react-router-dom";

const PrivateRoute = () => {
  // const user = "Vinay";
  const user = useSelector(state => state.auth)
  console.log(user?.userInfo)
  return <div>{user?.userInfo ? <Outlet /> : <Navigate to="/login" />}</div>;
};

export default PrivateRoute;
