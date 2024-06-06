import React from 'react';
import './index.css';
import { useSelector } from 'react-redux';
import { AiFillHome } from 'react-icons/ai';
import { MdOutlineBed } from 'react-icons/md';
import { GoListOrdered } from 'react-icons/go';
import { FiMessageSquare } from 'react-icons/fi';
const selectedCss = 'selected-sidebar-color';

const userRole = {
  MOD: 3,
  ADMIN: 2,
  NORMAL_USER: 1,
};

const SideBarWrap = (props) => {
  const users = useSelector((state) => state.userReducer);
  const userRoleStatus = users.currentUser ? users.currentUser.role : '';

  return (
    <>
      {userRoleStatus === userRole.MOD && (
        <ul className="sidebar-wrap-items">
          <li
            className={`sidebar-wrap-item ${props.sidebarDisplay === 111 ? selectedCss : ''}`}
            onClick={() => {
              props.setSidebarDisplay(111);
              props.setSelectedSidebar(-1);
            }}
          >
            <AiFillHome className="sidebar-wrap-item-icon"></AiFillHome>
            <p className="sidebar-wrap-item-title">Home</p>
          </li>
          <li
            className={`sidebar-wrap-item ${props.sidebarDisplay === 222 ? selectedCss : ''}`}
            onClick={() => {
              props.setSidebarDisplay(222);
              props.setSelectedSidebar(-1);
            }}
          >
            <MdOutlineBed className="sidebar-wrap-item-icon"></MdOutlineBed>
            <p className="sidebar-wrap-item-title">Houses</p>
          </li>
          <li
            className={`sidebar-wrap-item ${props.sidebarDisplay === 333 ? selectedCss : ''}`}
            onClick={() => {
              props.setSidebarDisplay(333);
              props.setSelectedSidebar(-1);
            }}
          >
            <MdOutlineBed className="sidebar-wrap-item-icon"></MdOutlineBed>
            <p className="sidebar-wrap-item-title">My Houses</p>
          </li>
          <li
            className={`sidebar-wrap-item ${props.sidebarDisplay === 444 ? selectedCss : ''}`}
            onClick={() => {
              props.setSidebarDisplay(444);
              props.setSelectedSidebar(-1);
            }}
          >
            <FiMessageSquare className="sidebar-wrap-item-icon"></FiMessageSquare>
            <p className="sidebar-wrap-item-title">Message</p>
          </li>
        </ul>
      )}
      {userRoleStatus === userRole.ADMIN && (
        <ul className="sidebar-wrap-items">
          <li
            className={`sidebar-wrap-item ${props.sidebarDisplay === 1 ? selectedCss : ''}`}
            onClick={() => {
              props.setSidebarDisplay(1);
              props.setSelectedSidebar(-1);
            }}
          >
            <AiFillHome className="sidebar-wrap-item-icon"></AiFillHome>
            <p className="sidebar-wrap-item-title">Home</p>
          </li>
          <li
            className={`sidebar-wrap-item ${props.sidebarDisplay === 2 ? selectedCss : ''}`}
            onClick={() => {
              props.setSidebarDisplay(2);
              props.setSelectedSidebar(-1);
            }}
          >
            <MdOutlineBed className="sidebar-wrap-item-icon"></MdOutlineBed>
            <p className="sidebar-wrap-item-title">Rooms</p>
          </li>

          <li
            className={`sidebar-wrap-item ${props.sidebarDisplay === 3 ? selectedCss : ''}`}
            onClick={() => {
              props.setSidebarDisplay(3);
              props.setSelectedSidebar(-1);
            }}
          >
            <FiMessageSquare className="sidebar-wrap-item-icon"></FiMessageSquare>
            <p className="sidebar-wrap-item-title">Message</p>
          </li>
          <li
            className={`sidebar-wrap-item ${props.sidebarDisplay === 4 ? selectedCss : ''}`}
            onClick={() => {
              props.setSidebarDisplay(4);
              props.setSelectedSidebar(-1);
            }}
          >
            <GoListOrdered className="sidebar-wrap-item-icon"></GoListOrdered>
            <p className="sidebar-wrap-item-title">List Users</p>
          </li>
        </ul>
      )}
      {userRoleStatus === userRole.NORMAL_USER && (
        <ul className="sidebar-wrap-items">
          <li
            className={`sidebar-wrap-item ${props.sidebarDisplay === 11 ? selectedCss : ''}`}
            onClick={() => {
              props.setSidebarDisplay(11);
              props.setSelectedSidebar(-1);
            }}
          >
            <AiFillHome className="sidebar-wrap-item-icon"></AiFillHome>
            <p className="sidebar-wrap-item-title">Home</p>
          </li>
          <li
            className={`sidebar-wrap-item ${props.sidebarDisplay === 12 ? selectedCss : ''}`}
            onClick={() => {
              props.setSidebarDisplay(12);
              props.setSelectedSidebar(-1);
            }}
          >
            <MdOutlineBed className="sidebar-wrap-item-icon"></MdOutlineBed>
            <p className="sidebar-wrap-item-title">Rooms</p>
          </li>
          <li
            className={`sidebar-wrap-item ${props.sidebarDisplay === 13 ? selectedCss : ''}`}
            onClick={() => {
              props.setSidebarDisplay(13);
              props.setSelectedSidebar(-1);
            }}
          >
            <MdOutlineBed className="sidebar-wrap-item-icon"></MdOutlineBed>
            <p className="sidebar-wrap-item-title">Rooms</p>
          </li>
        </ul>
      )}
    </>
  );
};

export default SideBarWrap;
