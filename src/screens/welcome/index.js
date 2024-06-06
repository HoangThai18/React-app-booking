import './index.css';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

function WelcomeUser() {
  let users = useSelector((state) => state.userReducer);
  let activeUser = getLoggedInUser();
  const navigate = useNavigate();
  function backToHome() {
    navigate('/');
  }
  function getLoggedInUser() {
    const index = users.userList.findIndex((user) => user.status === 1);
    return users.userList[index].username;
  }

  return (
    <header id="welcomeUser" className="welcome-user">
      <div className="wlcome-ctn">
        <div className="login-close">
          <p onClick={backToHome}>x</p>
        </div>
        <div className="wc-content">
          <h1 className="wc-title">Welcome</h1>
          <p id="showWelcome" className="wc-user-name">
            {activeUser}
          </p>
        </div>
      </div>
    </header>
  );
}
export default WelcomeUser;
