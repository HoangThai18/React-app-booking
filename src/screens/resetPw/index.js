import './index.css';
import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUserByUsername, updatePassword } from '../../db/userDTO';
import { FiArrowLeft, FiX } from 'react-icons/fi';
import { useDispatch } from 'react-redux';
import { setLoading } from '../../actions/config';

const userNameSetUP = 'Username';
const userNotFoundMsg = 'User Not Found';

const warningColorInput = 'warning-color-outline';
const warningColor = 'warning-color';
const successColorInput = 'success-color-outline';
const successColor = 'success-color';

function ResetPasswordPage() {
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPw, setConfirmPw] = useState('');
  const [labelUserWarning, setLabelUserWarning] = useState(userNameSetUP);
  const [labelConfirmPwWarning, setLabelConfirmPwWarning] = useState(successColor);
  const [outlineConfirmPw, setOutlineConfirmPw] = useState('');
  const [userWarningInput, setUserWarningInput] = useState('');
  const [userWarningColor, setUserWarningColor] = useState('');
  const [step, setStep] = useState(1);

  const focusRef = useRef();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  function backToHome() {
    navigate('/');
  }

  function backToLogin() {
    navigate('/login');
  }

  function handleUserNameChange(e) {
    setUserName(e.target.value);
  }

  function handlePasswordChange(e) {
    setPassword(e.target.value);
  }
  function handleConfirmPasswordChange(e) {
    setConfirmPw(e.target.value);
  }

  async function checkUserExists(username) {
    let userMatched = await getUserByUsername(username);
    return userMatched;
  }

  async function handleContinueClick() {
    dispatch(setLoading(true));
    let status = await checkUserExists(userName.toLowerCase());
    if (status !== undefined) {
      setLabelUserWarning(userNameSetUP);
      setUserWarningColor(successColor);
      setUserWarningInput(successColorInput);
      setStep(2);
      dispatch(setLoading(false));
    } else {
      setLabelUserWarning(userNotFoundMsg);
      setUserWarningColor(warningColor);
      setUserWarningInput(warningColorInput);
      focusRef.current.focus();
      dispatch(setLoading(false));
    }
  }

  async function handleResetPassword() {
    if (password === confirmPw) {
      dispatch(setLoading(true));
      const updateStatus = await updatePassword(userName, password);
      if (updateStatus) {
        alert('Reset Password Success!');
        dispatch(setLoading(false));
        backToLogin();
      } else {
        alert('Reset Password Failed!');
        dispatch(setLoading(false));
      }
    } else {
      setOutlineConfirmPw(warningColorInput);
      setLabelConfirmPwWarning(warningColor);
    }
  }

  function showUserNameField() {
    setStep(1);
  }

  return (
    <>
      <div id="fogPassForm" className="fogPass">
        <div className="fogPass-cont">
          <img
            className="poster-form"
            src="https://i.pinimg.com/236x/16/22/31/162231131a07dda331e720811b87f9d8.jpg"
            alt=""
          ></img>
          <div className="fogPass-form">
            <div className="fogPass-directional">
              {step === 1 && (
                <p onClick={backToLogin} className="fogPass-lable">
                  <FiArrowLeft></FiArrowLeft>
                </p>
              )}
              {step === 2 && (
                <p onClick={showUserNameField} className="fogPass-lable">
                  <FiArrowLeft></FiArrowLeft>
                </p>
              )}
              <p className="fogPass-close" onClick={backToHome}>
                <FiX></FiX>
              </p>
            </div>
            <div className="fogPass-main">
              <img
                src="https://vuainnhanh.com/wp-content/uploads/2023/02/logo-van-lang-896x1024-1.png"
                alt=""
                className="fogPass-logo"
              ></img>
              <p className="fogPass-title">Forgot Password</p>
            </div>
            <div className="fogPass-action">
              {step === 1 && (
                <>
                  <div className="field-group">
                    <input
                      id="userName"
                      ref={focusRef}
                      className={`form-input ${userWarningInput}`}
                      type="text"
                      value={userName}
                      onChange={handleUserNameChange}
                      required
                    ></input>
                    <label htmlFor="userName" className={`form-label ${userWarningColor}`}>
                      {labelUserWarning}
                    </label>
                  </div>
                  <button onClick={handleContinueClick} className="fogPass-submit-btn">
                    Next
                  </button>
                </>
              )}
              {step === 2 && (
                <>
                  <div className="field-group">
                    <input
                      id="userPassword"
                      className="form-input"
                      type="password"
                      value={password}
                      onChange={handlePasswordChange}
                      required
                    ></input>
                    <label htmlFor="userPassword" className="form-label">
                      New Password
                    </label>
                  </div>
                  <div className="field-group">
                    <input
                      id="confirmPassword"
                      className={`form-input ${outlineConfirmPw}`}
                      type="password"
                      value={confirmPw}
                      onChange={handleConfirmPasswordChange}
                      required
                    ></input>
                    <label htmlFor="confirmPassword" className={`form-label ${labelConfirmPwWarning}`}>
                      Confirm Password
                    </label>
                  </div>
                  <button onClick={handleResetPassword} className="fogPass-submit-btn">
                    Reset password
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default ResetPasswordPage;
