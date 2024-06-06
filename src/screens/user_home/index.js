import './index.css';
import NavBar from '../../components/navBar';
import SideBarWrap from '../../components/sideBarWrap';
import SidebarContent from '../../components/sideBarContent';
import { useState, useEffect } from 'react';

function UserHomePage() {
  const tempSidebarNum = parseInt(localStorage.getItem('sidebarNo'));

  const sidebarNumber = tempSidebarNum;

  const [sidebarDisplay, setSidebarDisplay] = useState(sidebarNumber);

  const [selectedSidebar, setSelectedSidebar] = useState(-1);

  useEffect(() => {
    localStorage.setItem('sidebarNo', sidebarDisplay.toString());
  }, [sidebarDisplay]);

  return (
    <>
      <NavBar setSidebarDisplay={setSidebarDisplay} setSelectedSidebar={setSelectedSidebar} />
      <div className="sidebar">
        <SideBarWrap
          // sidebar state
          sidebarDisplay={sidebarDisplay}
          setSidebarDisplay={setSidebarDisplay}
          //set tab selected
          setSelectedSidebar={setSelectedSidebar}
          /// get API
        ></SideBarWrap>
        <SidebarContent
          className="sidebar-content"
          // sidebar state
          sidebarDisplay={sidebarDisplay}
          // sidebar selected admin
          //set tab selected
          selectedSidebar={selectedSidebar}
          setSelectedSidebar={setSelectedSidebar}
          /// get API
        ></SidebarContent>
      </div>
    </>
  );
}

export default UserHomePage;
