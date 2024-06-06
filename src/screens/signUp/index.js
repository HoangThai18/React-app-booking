import React, { useState } from 'react';
import './index.css';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setLoading } from '../../actions/config';
import { addNewUser, checkUserName } from '../../db/userDTO';
import { FiX } from 'react-icons/fi';

const childBank = {
  bankAcc: '',
  accBankName: '',
  bankName: '',
};
function SignUpPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [passwordError, setPasswordError] = useState('');
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    confirmPassword: '',
    role: 1,
    gender: 'Male',
  });
  const [formBankData, setFormBankData] = useState(childBank);
  function handleChange(e) {
    const { name, value } = e.target;
    if (name === 'role' && value === '0') {
      return;
    }
    setFormData({
      ...formData,
      [name]: value,
    });
    setPasswordError('');
  }
  const handleInputChangeChild = (e) => {
    const { name, value } = e.target;
    if (name === 'bankAcc') {
      if (/^\d{0,20}$/.test(value)) {
        setFormBankData({
          ...formBankData,
          [name]: value,
        });
      }
    } else if (name === 'accBankName') {
      if (/^[\s\S]{0,25}$/.test(value)) {
        setFormBankData({
          ...formBankData,
          [name]: value,
        });
      }
    } else {
      setFormBankData({
        ...formBankData,
        [name]: value,
      });
    }
  };
  const handleKeyPress = (e) => {
    const isNumber = /^\d$/;
    if (!isNumber.test(e.key) || e.target.value.length >= 10) {
      e.preventDefault();
    }
  };
  const handleKeyPressForm = (e) => {
    const condition = /^[\s\S]/;
    if (!condition.test(e.key) || e.target.value.length >= 30) {
      e.preventDefault();
    }
  };
  async function handleSubmit(e) {
    e.preventDefault();
    dispatch(setLoading(true));
    const userExists = await checkUserName(formData.username);
    if (formData.password !== formData.confirmPassword) {
      setPasswordError('Passwords do not match. Please re-enter.');
      dispatch(setLoading(false));
    } else if (userExists) {
      setPasswordError('Username already exists. Please choose a different one.');
      dispatch(setLoading(false));
    } else if (formData.role === '0') {
      setPasswordError('Please select role.');
    } else {
      const newUser = {
        username: formData.username.toLowerCase(),
        password: formData.password,
        status: 0,
        urlImg: 'https://tse1.mm.bing.net/th?id=OIP.qovmIY1jRM75WWIgtIInXQHaHa&pid=Api&P=0&h=180',
        gender: formData.gender,
        fullName: formData.fullName,
        address: formData.address,
        email: formData.email,
        role: formData.role,
        editability: 0,
        isActive: 1,
        phone: formData.phone,
        keywords: generateKeywords(formData.username?.toLowerCase()),
        bank: formBankData,
      };
      const createUserStatus = await addNewUser(newUser);
      if (createUserStatus === true) {
        alert('Sign Up Success!');
        navigate('/login');
        dispatch(setLoading(false));
      } else {
        alert('Sign Up Failed!');
        dispatch(setLoading(false));
      }
    }
  }
  function backToHome() {
    navigate('/');
  }

  function goToLogin() {
    navigate('/login');
  }
  function goToSignUp() {
    navigate('/signUp');
  }

  const generateKeywords = (displayName) => {
    const name = displayName.split(' ').filter((word) => word);

    const length = name.length;
    let flagArray = [];
    let result = [];
    let stringArray = [];

    for (let i = 0; i < length; i++) {
      flagArray[i] = false;
    }

    const createKeywords = (name) => {
      const arrName = [];
      let curName = '';
      name.split('').forEach((letter) => {
        curName += letter;
        arrName.push(curName);
      });
      return arrName;
    };

    function findPermutation(k) {
      for (let i = 0; i < length; i++) {
        if (!flagArray[i]) {
          flagArray[i] = true;
          result[k] = name[i];

          if (k === length - 1) {
            stringArray.push(result.join(' '));
          }

          findPermutation(k + 1);
          flagArray[i] = false;
        }
      }
    }

    findPermutation(0);

    const keywords = stringArray.reduce((acc, cur) => {
      const words = createKeywords(cur);
      return [...acc, ...words];
    }, []);

    return keywords;
  };
  return (
    <>
      <header id="Wrapper">
        <div id="signUpForm" className="signup">
          <div className="signup-cont">
            <img
              className="signup-poster"
              src="https://i.pinimg.com/236x/16/22/31/162231131a07dda331e720811b87f9d8.jpg"
              alt=""
            />
            <div className="signup-form">
              <div className="signup-close" onClick={backToHome}>
                <FiX></FiX>
              </div>
              <div className="signup-main">
                <p className="signup-title">Register</p>
              </div>
              <form onSubmit={goToSignUp} className="signup-action">
                <div className="signup-paswprd-form">
                  {' '}
                  <div className="signup-group username-input-width">
                    <input
                      id="signupUserName"
                      className="signup-group-input"
                      type="text"
                      placeholder=""
                      name="username"
                      value={formData.username}
                      onChange={handleChange}
                      onKeyPress={(e) => {
                        handleKeyPressForm(e);
                      }}
                      required
                    />
                    <label htmlFor="signupUserName" className="signup-group-label">
                      Username
                    </label>{' '}
                  </div>{' '}
                  <div className="signup-group username-input-width">
                    <select name="gender" id="signupGender" onChange={handleChange}>
                      <option value={formData.gender}>Male</option>
                      <option value={formData.gender}>Female</option>
                    </select>
                    <label htmlFor="signupGender" className="signup-group-label"></label>{' '}
                  </div>{' '}
                  <div className="signup-group username-input-width">
                    {' '}
                    <input
                      id="signupFullName"
                      className="signup-group-input"
                      type="text"
                      placeholder=""
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      onKeyPress={(e) => {
                        handleKeyPress(e);
                      }}
                      required
                    />
                    <label htmlFor="signupFullName" className="signup-group-label">
                      Phone
                    </label>
                  </div>
                </div>{' '}
                <div className="signup-paswprd-form">
                  <div className="signup-group">
                    <input
                      id="signupPassword"
                      className="signup-group-input"
                      type="password"
                      placeholder=""
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      onKeyPress={(e) => {
                        handleKeyPressForm(e);
                      }}
                      required
                    />
                    <label htmlFor="signupPassword" className="signup-group-label">
                      Password
                    </label>
                  </div>
                  <div className="signup-group">
                    <input
                      id="confirmPassword"
                      className="signup-group-input"
                      type="password"
                      placeholder=""
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      onKeyPress={(e) => {
                        handleKeyPressForm(e);
                      }}
                      required
                    />
                    <label htmlFor="confirmPassword" className="signup-group-label">
                      Confirm Password
                    </label>
                  </div>
                </div>
                <div className="signup-group username-input-width">
                  {' '}
                  <input
                    id="signupEmail"
                    className="signup-group-input"
                    type="text"
                    placeholder=""
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    onKeyPress={(e) => {
                      handleKeyPressForm(e);
                    }}
                    required
                  />
                  <label htmlFor="signupEmail" className="signup-group-label">
                    Email
                  </label>
                </div>{' '}
                <div className="signup-group username-input-width">
                  {' '}
                  <input
                    id="signupAddress"
                    className="signup-group-input"
                    type="text"
                    placeholder=""
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    onKeyPress={(e) => {
                      handleKeyPressForm(e);
                    }}
                    required
                  />
                  <label htmlFor="signupAddress" className="signup-group-label">
                    Address
                  </label>
                </div>{' '}
                <div className="signup-group username-input-width">
                  {' '}
                  <input
                    id="signupFullName"
                    className="signup-group-input"
                    type="text"
                    placeholder=""
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    onKeyPress={(e) => {
                      handleKeyPressForm(e);
                    }}
                    required
                  />
                  <label htmlFor="signupFullName" className="signup-group-label">
                    FullName
                  </label>
                </div>
                <div className="signup-group username-input-width">
                  {' '}
                  <input
                    id="signupAccBankName"
                    className="signup-group-input"
                    type="text"
                    placeholder=""
                    name="accBankName"
                    value={formBankData.accBankName}
                    onChange={handleInputChangeChild}
                    required
                  />
                  <label htmlFor="signupAccBankName" className="signup-group-label">
                    Account name
                  </label>
                </div>
                <div className="signup-paswprd-form">
                  <div className="signup-group username-input-width">
                    {' '}
                    <input
                      id="signupBankAcc"
                      className="signup-group-input"
                      type="text"
                      placeholder=""
                      name="bankAcc"
                      value={formBankData.bankAcc}
                      onChange={handleInputChangeChild}
                      required
                    />
                    <label htmlFor="signupBankAcc" className="signup-group-label">
                      Bank Account
                    </label>
                  </div>{' '}
                  <div className="signup-group username-input-width">
                    {' '}
                    <input
                      id="signupBankName"
                      className="signup-group-input"
                      type="text"
                      placeholder=""
                      name="bankName"
                      value={formBankData.bankName}
                      onChange={handleInputChangeChild}
                      required
                    />
                    <label htmlFor="signupBankName" className="signup-group-label">
                      Bank Name
                    </label>
                  </div>
                </div>{' '}
                {passwordError && <p className="error-text">{passwordError}</p>}
                <button type="submit" className="signup-submit-btn" onClick={handleSubmit}>
                  Sign Up
                </button>
              </form>
              <div className="signup-links">
                <p className="cus-signup-ques">
                  Already have an account?{' '}
                  <span>
                    <p className="cus-signup-text" onClick={goToLogin}>
                      Login
                    </p>
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>
    </>
  );
}

export default SignUpPage;
