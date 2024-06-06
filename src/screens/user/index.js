import './index.css';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { updateInfo } from '../../actions/user';
import { useNavigate, useLocation } from 'react-router-dom';
import { MdOutlineMedicalInformation } from 'react-icons/md';
import { HiOutlineMail } from 'react-icons/hi';
import { BiUserCircle, BiPhone } from 'react-icons/bi';
import { IoMdTransgender } from 'react-icons/io';
import { IoLocationOutline } from 'react-icons/io5';
import { BsCameraFill } from 'react-icons/bs';
import { PiBagSimpleBold } from 'react-icons/pi';
import { FiArrowLeft } from 'react-icons/fi';
import { FiPhone } from 'react-icons/fi';
import { updateUserData } from '../../db/userDTO';
import { setLoading } from '../../actions/config';

function UserInfoPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const { state } = location;

  const [formData, setFormData] = useState({ ...state.currentUser });
  const [profilePage, setProfilePage] = useState(false);
  const [addUrlStatus, setAddUrlStatus] = useState(false);

  const activeFullNameUser = formData.fullName;
  const activeRoleUser = formData.role;
  const nickNameUser = createNickname();

  function goToUserHome() {
    navigate('/userHome', {
      state: { displaySidebar: state.type === 1 ? state.sidebarDisplay : state.displaySidebar },
    });
  }
  function createNickname() {
    const nameParts = activeFullNameUser.split(' ');
    if (nameParts.length > 1) {
      const nickname = nameParts[nameParts.length - 1] + ' ' + nameParts[0];
      return nickname;
    }
    return nameParts[0];
  }

  // Update
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async () => {
    try {
      dispatch(setLoading(true));
      if (!formData.fullName || !formData.address || !formData.email || !formData.gender || !formData.company) {
        alert('Please fill in all required fields.');
        dispatch(setLoading(false));
        return;
      }
      await updateUserData(formData.username, formData);
      dispatch(updateInfo(formData));
      alert('Update success!');
      setProfilePage(false);
      dispatch(setLoading(false));
    } catch (ex) {
      return false;
    }
  };

  function editProfile() {
    setProfilePage(!profilePage);
    return formData;
  }

  function addUrl() {
    const avatarImg = document.getElementById('userAvatar');
    if (avatarImg && formData.urlImg) {
      avatarImg.src = formData.urlImg;
    }
  }
  return (
    <>
      <div className="profile-cont">
        <div
          className="profile-cont-back"
          onClick={
            profilePage === false
              ? goToUserHome
              : () => {
                  setProfilePage(!profilePage);
                }
          }
        >
          <FiArrowLeft></FiArrowLeft>
          <p>Back</p>
        </div>
        {profilePage === false && (
          <div className="profile-info">
            <div className="profile-main-info">
              <img className="profile-avatar" src={formData.urlImg} alt=""></img>
              <p className="profile-main-fullname">{nickNameUser}</p>
              <p className="profile-main-username">Role: {activeRoleUser === 1 ? 'User' : 'Admin'}</p>
            </div>
            <div className="user-info">
              <p className="profile-info-title">{nickNameUser}'s Profile</p>
              <div className="edit-profile">
                <button className="edit-profile-btn" onClick={editProfile}>
                  Edit Profile
                </button>
              </div>
              <ul className="profile-secondary-info">
                <li className="profile-secondary-li">
                  <MdOutlineMedicalInformation className="user-info-icon"></MdOutlineMedicalInformation>
                  <label>Full Name:</label>
                  <p className="user-info-content">{formData.fullName}</p>
                </li>
                <li className="profile-secondary-li">
                  <BiUserCircle className="user-info-icon"></BiUserCircle>
                  <label>User Name:</label>
                  <p className="user-info-content">{formData.username}</p>
                </li>
                <li className="profile-secondary-li">
                  <HiOutlineMail className="user-info-icon"></HiOutlineMail>
                  <label>Email:</label>
                  <p className="user-info-content">{formData.email}</p>
                </li>

                <li className="profile-secondary-li">
                  <PiBagSimpleBold className="user-info-icon"></PiBagSimpleBold>
                  <label>Company:</label>
                  <p className="user-info-content">{formData.company}</p>
                </li>
                <li className="profile-secondary-li">
                  <FiPhone className="user-info-icon"></FiPhone>
                  <label>Phone:</label>
                  <p className="user-info-content">{formData.phone}</p>
                </li>
                <li className="profile-secondary-li">
                  <IoMdTransgender className="user-info-icon"></IoMdTransgender>
                  <label>Gender:</label>
                  <p className="user-info-content">{formData.gender}</p>
                </li>
                <li className="profile-secondary-address">
                  <IoLocationOutline className="user-info-icon"></IoLocationOutline>
                  <label>Address:</label>
                  <p className="user-info-content">{formData.address}</p>
                </li>
              </ul>
            </div>
          </div>
        )}
        {profilePage === true && (
          <div className="profile-info">
            <div className="profile-main-cont">
              <div className="profile-main-info">
                <img id="userAvatar" className="update-avatar" src={formData.urlImg} alt=""></img>
                <div className="add-avatar">
                  <BsCameraFill className="add-avatar-icon"></BsCameraFill>
                  <p
                    className="add-avatar-text"
                    onClick={() => {
                      setAddUrlStatus(true);
                    }}
                  >
                    Add
                  </p>
                </div>
              </div>
              {addUrlStatus === true && (
                <div className="add-url-btn">
                  <input
                    className="update-url"
                    type="text"
                    name="urlImg"
                    value={formData.urlImg}
                    onChange={handleInputChange}
                  ></input>
                  <button
                    className="update-url-btn"
                    onClick={() => {
                      addUrl();
                      setAddUrlStatus(false);
                    }}
                  >
                    Add Url
                  </button>
                </div>
              )}
            </div>

            <div className="user-info">
              <p className="profile-info-title">Update Information</p>
              <form className="update-profile-secondary">
                <div className="update-group">
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    required
                    id="updateFullname"
                    onChange={handleInputChange}
                    className={`update-group-input`}
                    placeholder=""
                  ></input>
                  <label htmlFor="updateFullname" className={`update-group-label`}>
                    Full Name
                  </label>
                  <MdOutlineMedicalInformation className="update-info-icon"></MdOutlineMedicalInformation>
                </div>
                <div className="update-group">
                  <input
                    type="text"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    id="updateEmail"
                    className={`update-group-input`}
                    placeholder=""
                  ></input>
                  <label htmlFor="updateEmail" className={`update-group-label`}>
                    Email
                  </label>
                  <HiOutlineMail className="update-info-icon"></HiOutlineMail>
                </div>
                <div className="update-group">
                  <input
                    required
                    id="updateEmail"
                    className={`update-group-input`}
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder=""
                  ></input>
                  <label htmlFor="updateEmail" className={`update-group-label`}>
                    Phone
                  </label>
                  <BiPhone className="update-info-icon"></BiPhone>
                </div>
                <div className="update-group">
                  <input
                    required
                    id="updateEmail"
                    className={`update-group-input`}
                    name="company"
                    value={formData.company}
                    onChange={handleInputChange}
                    type="text"
                    placeholder=""
                  ></input>
                  <label htmlFor="updateEmail" className={`update-group-label`}>
                    Company
                  </label>
                  <PiBagSimpleBold className="update-info-icon"></PiBagSimpleBold>
                </div>
                <div className="update-group">
                  <div className="update-group-gender">
                    <div className="cus-gender-items">
                      <label className="cus-gender-label">Male: </label>
                      <input
                        type="radio"
                        name="gender"
                        value="male"
                        checked={formData.gender === 'male'}
                        className="cus-gender-radio"
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="cus-gender-items">
                      <label className="cus-gender-label">Female: </label>
                      <input
                        type="radio"
                        name="gender"
                        value="female"
                        checked={formData.gender === 'female'}
                        onChange={handleInputChange}
                        className="cus-gender-radio"
                      />
                    </div>
                    <div className="cus-gender-items">
                      <label className="cus-gender-label">Other: </label>
                      <input
                        type="radio"
                        name="gender"
                        value="Other"
                        checked={formData.gender === 'Other'}
                        className="cus-gender-radio"
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                </div>
                <div className="update-group-address">
                  <input
                    required
                    id="updateAddress"
                    className={`update-group-input`}
                    value={formData.address}
                    onChange={handleInputChange}
                    type="text"
                    name="address"
                    placeholder=""
                  ></input>
                  <label htmlFor="updateAddress" className={`update-group-label`}>
                    Address
                  </label>
                  <IoLocationOutline className="update-info-icon"></IoLocationOutline>
                </div>
              </form>
              <div className="update-profile">
                <button
                  className="update-profile-btn"
                  onClick={() => {
                    handleSubmit();
                    setAddUrlStatus(false);
                  }}
                >
                  Completed
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
export default UserInfoPage;
