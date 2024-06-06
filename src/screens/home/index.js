/* eslint-disable */
import { useState, useEffect } from 'react';
import './index.css';
import NavBar from '../../components/navBar';
import { useSelector, useDispatch } from 'react-redux';

// Side Effect
//// Use Effect
//// Callback đều được gọi sau khi component mounted
////// 1 - useEffect(callback)
////// -- Luôn luôn gọi mỗi khi component re-render
////// 2 - useEffect(callback,[])
////// -- Chỉ gọi 1 lần đầu khi component render xong
////// 3 - useEffect(callback,[dependences])

function HomePage() {
  const userListReducer = useSelector((state) => state.userReducer.userList);
  const dispatch = useDispatch();

  const [searchTxt, setSearchTxt] = useState('');
  const [users, setUsers] = useState([]);

  // Dành cho Search Text
  useEffect(() => {
    if (userListReducer.length > 0) {
      let tempUsers = userListReducer.find((user) => user.name === searchTxt);
      setUsers(tempUsers ? [tempUsers] : []);
    }
  }, [searchTxt]);
  // Dành cho Search Text

  return (
    <>
      <NavBar />
      {users.map((user) => (
        <>
          <li id={`name_${user.id}`}>Name:{user.name}</li>
          <li id={`web_${user.id}`}>Website:{user.website}</li>
          <li id={`phone_${user.id}`}>Phone:{user.phone}</li>
        </>
      ))}
    </>
  );
}

export default HomePage;
