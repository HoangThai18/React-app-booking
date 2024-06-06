import NavBar from '../../components/navBar';
import SidebarContent from '../../components/sideBarContent';
import { useState, useEffect } from 'react';

function InternalExchange() {
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

export default InternalExchange;
