import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import { useState } from 'react';
import HomePage from './screens/home';
import LoginPage from './screens/login';
import ResetPasswordForm from './screens/resetPw';
import SignUp from './screens/signUp';
import UserPage from './screens/user';
import ErrorPage from './screens/error';
import UserHomePage from './screens/user_home';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setCurrentUser } from './actions/user';
import InternalExchange from './screens/internalExchange';
import RoomDetail from './screens/roomDetail';
function App() {
  const URL = {
    home: '/',
    login: '/login',
    signUp: '/signUp',
    resetPw: '/resetPw',
    error: '/error',
    userHome: '/userHome',
    infoUser: '/infoUser',
    internalExchange: '/internalExchange',
    detail: '/detail',
  };

  const invalidURL = '/*';
  const dispatch = useDispatch();

  const [isLoggedIn, setLoggedIn] = useState(String(localStorage.getItem('isLoggedIn')));

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    const storedExpirationTime = parseInt(localStorage.getItem('expirationTime'));

    if (storedUser && storedExpirationTime) {
      const currentTime = new Date().getTime();
      if (currentTime < storedExpirationTime) {
        dispatch(setCurrentUser(storedUser));
      } else {
        localStorage.removeItem('user');
        localStorage.removeItem('expirationTime');
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('sidebarNo');
      }
    }
  }, [dispatch]);

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path={URL.home} exact element={<HomePage />} />
          <Route path={URL.home + invalidURL} element={<Navigate to={URL.home} replace />} />
          <Route path={URL.login} exact element={<LoginPage setLoggedIn={setLoggedIn} />} />
          <Route path={URL.login + invalidURL} element={<Navigate to={URL.login} replace />} />
          <Route path={URL.resetPw} element={<ResetPasswordForm />} />
          <Route path={URL.resetPw + invalidURL} element={<Navigate to={URL.resetPw} replace />} />
          <Route path={URL.signUp} element={<SignUp />} />
          <Route path={URL.signUp + invalidURL} element={<Navigate to={URL.signUp} replace />} />
          <Route path={URL.error} element={<ErrorPage />} />
          <Route path={URL.error + invalidURL} element={<Navigate to={URL.error} replace />} />
          <Route
            path={URL.userHome}
            element={isLoggedIn === 'true' ? <UserHomePage /> : <Navigate to={URL.login} replace />}
          />
          <Route path={URL.userHome + invalidURL} element={<Navigate to={URL.userHome} replace />} />
          <Route path={URL.infoUser} element={<UserPage />} />
          <Route path={URL.infoUser + invalidURL} element={<Navigate to={URL.infoUser} replace />} />
          <Route path={URL.internalExchange} exact element={<InternalExchange />} />
          <Route path={URL.internalExchange + invalidURL} element={<Navigate to={URL.internalExchange} replace />} />
          <Route
            path={URL.detail}
            exact
            element={isLoggedIn === 'true' ? <RoomDetail /> : <Navigate to={URL.login} replace />}
          />
          <Route path={URL.detail + invalidURL} element={<Navigate to={URL.detail} replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
