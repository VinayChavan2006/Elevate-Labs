import React, { useState } from "react";
import "./SideBar.css";
import {
  Home,
  MessageSquare,
  Users,
  Bell,
  Calendar,
  Settings,
  LogOut,
  Menu, // Import Menu icon for hamburger
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useLogoutMutation } from "../redux/api/userSlice.js";
import { Logout } from "../redux/features/authSlice.js";
import { useNavigate } from "react-router-dom";
import { socket } from "../socket/socket.js";

// Pass isExpanded and toggleSidebar as props
function Sidebar() {
  const [isExpanded, setIsExpanded] = useState(false);

  // get user name
  const {userInfo} = useSelector(store => store.auth)
  const toggleSidebar = () => {
    setIsExpanded(!isExpanded);
  };

  // for navigation
  const navigate = useNavigate()

  // handle logout
  const dispatch = useDispatch()
  const [logout,{isLoading}] = useLogoutMutation()
  const handleLogout = async () => {
    try {
      const {data} = await logout();
      if(data){
        socket.emit('logout',data?.userId)
        dispatch(Logout())
        navigate("/login")
      }
    } catch (error) {
      alert(`Error Logging Out: ${error}`)
    }
  }


  return (
    <div className={`sidebar ${isExpanded ? "expanded" : "collapsed"}`}>
        <button
          className="hamburger-menu"
          onClick={toggleSidebar}
          aria-label="Toggle Sidebar"
        >
          <Menu size={24} />
        </button>
      <div className="sidebar-header">
        {/* Hamburger icon for toggling sidebar */}
        

        {/* Only show user avatar and name when expanded */}
        {isExpanded && (
          <div className="flex flex-col items-center w-full p-2">
            <img
              src={`${userInfo.profileImage}`} // Placeholder for user avatar
              alt="User Avatar"
              className="user-avatar"
            />
            <span className="user-name">{userInfo?.name}</span>
          </div>
        )}
      </div>
      <nav className="sidebar-nav">
        <ul>
          <li className="nav-item">
            <Home size={20} />
            {isExpanded && <span>Home</span>}
          </li>
          <li className="nav-item active">
            <MessageSquare size={20} />
            {isExpanded && <span>Chat</span>}
          </li>
          {/* <li className="nav-item">
            <Users size={20} />
            {isExpanded && <span>Contact</span>}
          </li>
          <li className="nav-item">
            <Bell size={20} />
            {isExpanded && <span>Notifications</span>}
          </li>
          <li className="nav-item">
            <Calendar size={20} />
            {isExpanded && <span>Calendar</span>}
          </li>
          <li className="nav-item">
            <Settings size={20} />
            {isExpanded && <span>Settings</span>}
          </li> */}
        </ul>
      </nav>
      <div className="sidebar-footer" onClick={handleLogout}>
        <LogOut size={20} />
        {isExpanded && <span>Log Out</span>}
      </div>
    </div>
  );
}

export default Sidebar;
