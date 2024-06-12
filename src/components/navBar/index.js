import './index.css';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { setCurrentUser } from '../../actions/user';
import { useState } from 'react';
import { BiSearch } from 'react-icons/bi';
import { BsList } from 'react-icons/bs';
import { FiX } from 'react-icons/fi';
import { setLoading } from '../../actions/config';
function NavBar() {
  const [dropdownStatus, setDropdownStatus] = useState(false);
  const [searchContent, setSearchContent] = useState('');

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const users = useSelector((state) => state.userReducer);
  const activeUser = getActiveUserData('username');
  const activeFullNameUser = getActiveUserData('fullname');
  const navBarAvatar = getActiveUserData('avatar');
  const activeNickNameUser = createNickname();
  const navBarStatus = activeUser !== '';

  function getActiveUserData(data) {
    switch (data) {
      case 'fullname':
        return users.currentUser ? users.currentUser.fullName : '';
      case 'username':
        return users.currentUser ? users.currentUser.username : '';
      case 'avatar':
        return users.currentUser ? users.currentUser.urlImg : '';
      default:
        return data;
    }
  }

  function createNickname() {
    const nameParts = activeFullNameUser.split(' ');
    if (nameParts.length > 1) {
      const nickname = nameParts[nameParts.length - 1] + ' ' + nameParts[0];
      return nickname;
    }
    return nameParts[0];
  }

  function logoutUser() {
    try {
      dispatch(setLoading(true));

      setTimeout(() => {
        dispatch(setCurrentUser(undefined));
        dispatch(setLoading(false));
        goToHome();
        localStorage.removeItem('user');
        localStorage.removeItem('expirationTime');
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('sidebarNo');
      }, 500);
    } catch (e) {
      dispatch(setLoading(false));
    }
  }

  function goToHome() {
    navigate('/');
  }
  function goToLogin() {
    navigate('/login');
  }
  function goToUserHome() {
    navigate('/userHome');
  }
  function goToSignUp() {
    navigate('/signUp');
  }

  function goToUserProfile() {
    navigate('/infoUser', {
      state: {
        currentUser: users.currentUser,
      },
    });
  }

  return (
    <header id="navBarWrapper">
      <>
        <p className="navbar-logo" onClick={!navBarStatus ? () => {} : goToUserHome}>
          IHOME
        </p>
        <div className="navbar-search">
          <BiSearch className="navbar-search-icon"></BiSearch>
          <input
            className="navbar-search-input"
            value={searchContent}
            onChange={(e) => setSearchContent(e.target.value)}
            placeholder="Search"
          ></input>
          {searchContent && (
            <FiX
              className="navbar-search-delete"
              onClick={() => {
                setSearchContent('');
              }}
            ></FiX>
          )}
        </div>
        <div className="navbar-login">
          {navBarStatus && <p className="wc_user_msg">Welcome, {activeNickNameUser}</p>}
          {!navBarStatus ? (
            <>
              <button className="navbar-signup-btn" onClick={goToSignUp}>
                SignUp
              </button>
              <button className="navbar-login-btn" onClick={goToLogin}>
                Login
              </button>
            </>
          ) : (
            <div className="navbar">
              <div
                className="wc-user-options"
                onClick={() => {
                  setDropdownStatus(!dropdownStatus);
                }}
              >
                <BsList className="wc-user-icon"></BsList>
                <div className="navbar-avatar">
                  <img className="navbar-avatar-img" src={navBarAvatar} alt=""></img>
                  {dropdownStatus && (
                    <ul className="wc_user-dropdown">
                      <li className="wc_user-dropdown-top">
                        <img className="navbar-avatar-dropdown" src={navBarAvatar} alt=""></img>
                        <div className="navbar-name-dropdown">
                          <p className="navbar-fullname-dropdown">{activeNickNameUser}</p>
                          <p className="navbar-username-dropdown">{activeUser}</p>
                        </div>
                      </li>
                      <li className="wc_user-dropdown-op" onClick={goToUserProfile}>
                        User Profile
                      </li>
                      <li className="wc_user-dropdown-op" onClick={logoutUser}>
                        LogOut
                      </li>
                    </ul>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </>
    </header>
  );
}

export default NavBar;
