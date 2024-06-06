import './index.css';
import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { getCategoryData, getCateID } from '../../db/categoryDTO';
const selectedSidebarCategory = 'cus-selected-sidebar-category ';

function Category(props) {
  const [selectedTab, setSelectedTab] = useState(0);
  const users = useSelector((state) => state.userReducer);
  const userRoleStatus = getUserRole();
  const [CategoriesData, setCategoriesData] = useState([]);
  const [roomByCateID, setRoomByCateID] = useState([]);

  function getUserRole() {
    return users.currentUser ? users.currentUser.role : '';
  }

  async function fetchCategoryData() {
    try {
      const cateData = await getCategoryData();
      setCategoriesData(cateData);
    } catch (error) {}
  }

  async function fetchCategoryId() {
    try {
      const categoryId = await getCateID();
      setRoomByCateID(categoryId);
    } catch (error) {}
  }
  useEffect(() => {
    fetchCategoryData();
  }, []);
  useEffect(() => {
    fetchCategoryId();
  }, []);
  useEffect(() => {
    if (props.selectedSidebar === -1) {
      setSelectedTab(roomByCateID[0]);
      props.setCateId(selectedTab);
    }
  }, [roomByCateID, props.selectedSidebar, selectedTab]);
  return (
    <>
      {userRoleStatus === 1 && (
        <>
          <div className="cus-sidebar-top">
            <ul className="cus-sidebar-content-category">
              {CategoriesData.map((category, index) => (
                <li
                  key={roomByCateID[index]}
                  className={`cus-sidebar-category ${
                    selectedTab === roomByCateID[index] ? selectedSidebarCategory : ''
                  }`}
                  onClick={() => {
                    props.setCateId(roomByCateID[index]);
                    setSelectedTab(roomByCateID[index]);
                    props.setSelectedSidebar(category.id);
                  }}
                >
                  {' '}
                  <img src={category.urlIcon} className="cus-sidebar-category-icon" alt="Category Icon" />{' '}
                  <p className="cus-sidebar-category-title">{category.title}</p>
                </li>
              ))}
            </ul>{' '}
          </div>{' '}
        </>
      )}
      {userRoleStatus === 2 && (
        <>
          <div className="cus-sidebar-top">
            <ul className="cus-sidebar-content-category">
              {CategoriesData.map((category, index) => (
                <li
                  key={roomByCateID[index]}
                  className={`cus-sidebar-category ${
                    selectedTab === roomByCateID[index] ? selectedSidebarCategory : ''
                  }`}
                  onClick={() => {
                    props.setCateId(roomByCateID[index]);
                    setSelectedTab(roomByCateID[index]);
                    props.setSelectedSidebar(category.id);
                  }}
                >
                  <img src={category.urlIcon} className="cus-sidebar-category-icon" alt="Category Icon" />{' '}
                  <p className="cus-sidebar-category-title">{category.title}</p>
                </li>
              ))}
            </ul>
          </div>
        </>
      )}

      {userRoleStatus === 3 && (
        <>
          <div className="cus-sidebar-top">
            <ul className="cus-sidebar-content-category">
              {CategoriesData.map((category, index) => (
                <li
                  key={roomByCateID[index]}
                  className={`cus-sidebar-category ${
                    selectedTab === roomByCateID[index] ? selectedSidebarCategory : ''
                  }`}
                  onClick={() => {
                    props.setCateId(roomByCateID[index]);
                    setSelectedTab(roomByCateID[index]);
                    props.setSelectedSidebar(category.id);
                  }}
                >
                  {' '}
                  <img src={category.urlIcon} className="cus-sidebar-category-icon" alt="Category Icon" />{' '}
                  <p className="cus-sidebar-category-title">{category.title}</p>
                </li>
              ))}
            </ul>
          </div>{' '}
        </>
      )}
    </>
  );
}
export default Category;
