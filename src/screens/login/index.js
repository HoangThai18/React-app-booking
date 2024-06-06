import './index.css';
import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setCurrentUser } from '../../actions/user';
import { setLoading } from '../../actions/config';
import { userLogin } from '../../db/userDTO';
import { FiX } from 'react-icons/fi';

const userNameSetUP = 'Username';
const passwordSetUP = 'Password';
const userNotFoundMsg = 'User Not Found';
const passwordWrongMsg = 'Password Wrong';
const warningColorInput = 'warning-color-outline';
const successColorInput = 'success-color-outline';
const warningColor = 'warning-color';
const successColor = 'success-color';

function LoginPage(props) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const focusUser = useRef();
  const focusPassword = useRef();

  const [userName, setUsername] = useState('');
  const [pw, setPw] = useState('');
  const [labelUserWarning, setLabelUserWarning] = useState(userNameSetUP);
  const [labelPasswordWarning, setLabelPasswordWarning] = useState(passwordSetUP);
  const [userWarningInput, setUserWarningInput] = useState('');
  const [passwordWarningInput, setPasswordWarningInput] = useState('');
  const [userWarningColor, setUserWarningColor] = useState('');
  const [passwordWarningColor, setPasswordWarningColor] = useState('');

  function backToHome() {
    navigate('/');
  }
  function goToUserHome() {
    navigate('/userHome');
  }
  function goToSignUp() {
    navigate('/signUp');
  }
  function goToResetPw() {
    navigate('/resetPw');
  }
  function goToError() {
    navigate('/error');
  }

  function onLogin(user, expTime) {
    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('expirationTime', expTime.toString());
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('sidebarNo', '-1');
  }

  async function login(e) {
    e.preventDefault();
    try {
      let checkDataExisted = '';
      let checkStatus = '';

      dispatch(setLoading(true));
      const userLoggedIn = await userLogin(userName.toLowerCase(), pw);
      const expTime = new Date().getTime() + 5 * 60 * 1000;

      if (userLoggedIn) {
        if (userLoggedIn.isActive === 1) {
          dispatch(setCurrentUser(userLoggedIn));
          onLogin(userLoggedIn, expTime);
          props.setLoggedIn(String(localStorage.getItem('isLoggedIn')));
          checkStatus = 'access';
          if (
            userLoggedIn.urlImg !== '' &&
            userLoggedIn.gender !== '' &&
            userLoggedIn.fullName !== '' &&
            userLoggedIn.address !== '' &&
            userLoggedIn.email !== ''
          ) {
            checkDataExisted = 'existed';
          }
        } else {
          goToError();
          dispatch(setLoading(false));
        }
      }

      if (userLoggedIn && checkStatus === 'access' && checkDataExisted === 'existed') {
        goToUserHome();
        dispatch(setLoading(false));
      } else if (userLoggedIn && checkStatus === 'access') {
        goToUserHome();
        setUserWarningInput(successColorInput);
        setPasswordWarningInput(successColorInput);
        setUserWarningColor(successColor);
        setPasswordWarningColor(successColor);
        dispatch(setLoading(false));
      } else {
        setLabelUserWarning(userNotFoundMsg);
        setUserWarningInput(warningColorInput);
        setLabelPasswordWarning(passwordWrongMsg);
        setPasswordWarningInput(warningColorInput);
        setUserWarningColor(warningColor);
        setPasswordWarningColor(warningColor);
        focusUser.current.focus();
        dispatch(setLoading(false));
      }
    } catch (ex) {}
  }

  return (
    <div id="loginForm" className="login">
      <div className="login-cont">
        <img
          className="login-poster"
          src="https://i.pinimg.com/236x/16/22/31/162231131a07dda331e720811b87f9d8.jpg"
          alt=""
        ></img>
        <div className="login-form">
          <div className="login-close">
            <FiX className="login-close-icon" onClick={backToHome}></FiX>
          </div>
          <div className="login-main">
            <img
              src="https://vuainnhanh.com/wp-content/uploads/2023/02/logo-van-lang-896x1024-1.png"
              alt=""
              className="login-logo"
            ></img>
            <p className="login-title">Welcome to Van Lang</p>
          </div>
          <form onSubmit={login} className="login-action">
            <div className="login-group">
              <input
                required
                id="userName"
                name="userName"
                className={`login-group-input ${userWarningInput}`}
                ref={focusUser}
                type="text"
                placeholder=""
                value={userName}
                onChange={(e) => setUsername(e.target.value)}
                autoComplete="on"
              ></input>
              <label htmlFor="userName" className={`login-group-label ${userWarningColor}`}>
                {labelUserWarning}
              </label>
            </div>
            <div className="login-group">
              <input
                required
                id="userPassword"
                name="userPassword"
                className={`login-group-input ${passwordWarningInput}`}
                ref={focusPassword}
                type="password"
                placeholder=""
                value={pw}
                onChange={(e) => setPw(e.target.value)}
                autoComplete="on"
              ></input>
              <label htmlFor="userPassword" className={`login-group-label ${passwordWarningColor}`}>
                {labelPasswordWarning}
              </label>
            </div>
            <button className="login-submit-btn" type="submit">
              Login
            </button>
          </form>
          <div className="login-links">
            <p className="cus-cont-sign-up">
              New User?{' '}
              <span>
                {' '}
                <p className="cus-text-sign-up" onClick={goToSignUp}>
                  Sign up
                </p>
              </span>
            </p>
            <p className="cus-text-fog-password" onClick={goToResetPw} href="#">
              Forgot Password ?
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
