import './index.css';
import { useState } from 'react';
import AdminPage from '../../screens/userListPage';
import Category from '../../screens/category';
import ChatRoom from '../../screens/chatRoom';
import MyRooms from '../../screens/myRooms';
import SideBarDisplay from '../../screens/sidebarDisplay';
import RentedRoom from '../../screens/rentedRoom';

const sideBarState = {
  HOME: -1,
  ADMIN_ROOMS: 2,
  ADMIN_CHAT: 3,
  ADMIN_LIST_USER: 4,
  USER_ROOMS: 12,
  USER_RENTED_ROOM: 13,
  MOD_ROOMS: 222,
  MOD_MY_ROOMS: 333,
  MOD_CHAT: 444,
};

function renderSubComponent(props, cateId, setCateId) {
  const sideBarIndex = props.sidebarDisplay;
  switch (sideBarIndex) {
    case sideBarState.HOME:
      return (
        <>
          <Category
            selectedSidebar={props.selectedSidebar}
            setSelectedSidebar={props.setSelectedSidebar}
            setCateId={setCateId}
          />
          <SideBarDisplay newid={cateId} />
        </>
      );
    case sideBarState.ADMIN_ROOMS:
      return (
        <>
          <Category
            selectedSidebar={props.selectedSidebar}
            setSelectedSidebar={props.setSelectedSidebar}
            setCateId={setCateId}
          />
          <SideBarDisplay newid={cateId} />
        </>
      );
    case sideBarState.ADMIN_CHAT:
      return <ChatRoom />;
    case sideBarState.ADMIN_LIST_USER:
      return <AdminPage />;
    case sideBarState.USER_ROOMS:
      return (
        <>
          <Category
            selectedSidebar={props.selectedSidebar}
            setSelectedSidebar={props.setSelectedSidebar}
            setCateId={setCateId}
          />
          <SideBarDisplay newid={cateId} />
        </>
      );
    case sideBarState.USER_RENTED_ROOM:
      return <RentedRoom></RentedRoom>;
    case sideBarState.MOD_ROOMS:
      return (
        <>
          <Category
            selectedSidebar={props.selectedSidebar}
            setSelectedSidebar={props.setSelectedSidebar}
            setCateId={setCateId}
          />
          <SideBarDisplay newid={cateId} />
        </>
      );
    case sideBarState.MOD_MY_ROOMS:
      return (
        <>
          <Category
            selectedSidebar={props.selectedSidebar}
            setSelectedSidebar={props.setSelectedSidebar}
            setCateId={setCateId}
          />
          <MyRooms newid={cateId} />;
        </>
      );

    case sideBarState.MOD_CHAT:
      return <ChatRoom />;
    default:
      return;
  }
}

function SidebarContent(props) {
  const [cateId, setCateId] = useState();

  return <div className="sidebar-content">{renderSubComponent(props, cateId, setCateId)}</div>;
}

export default SidebarContent;
