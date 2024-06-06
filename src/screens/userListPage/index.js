import './index.css';
import ConfirmationPopup from '../../components/confirmPopup';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUserByUsername, getUserList, updateUserActive } from '../../db/userDTO';
import { useDispatch } from 'react-redux';
import { setLoading } from '../../actions/config';

const emptyCell = '---';
const noUsersMsg = 'No users have registered yet';
const msgConfirmDisable = 'You will disable the active state for this user';
const msgConfirmEnable = 'You will enable the active state for this user';

function AdminPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [userList, setUserList] = useState([]);

  const [isPopupActiveOpen, setIsPopupActiveOpen] = useState(false);
  const [isPopupDeactiveOpen, setIsPopupDeactiveOpen] = useState(false);

  const [usernameToConfirm, setUsernameToConfirm] = useState('');

  async function fetchData() {
    try {
      const users = await getUserList();
      setUserList(users);
    } catch (e) {}
  }

  useEffect(() => {
    async function fetchDataAndHandleLoading() {
      try {
        dispatch(setLoading(true));
        await fetchData();
      } catch (e) {
      } finally {
        dispatch(setLoading(false));
      }
    }

    fetchDataAndHandleLoading();
  }, [dispatch]);

  async function handleEditInfo(username) {
    const user = await getUserByUsername(username);
    navigate('/infoUser', { state: { currentUser: user } });
  }

  function openPopup({ username, type }) {
    if (type === 1) {
      setUsernameToConfirm(username);
      setIsPopupActiveOpen(true);
    } else if (type === 2) {
      setUsernameToConfirm(username);
      setIsPopupDeactiveOpen(true);
    }
  }

  function closePopup(type) {
    if (type === 1) {
      setIsPopupActiveOpen(false);
    } else if (type === 2) {
      setIsPopupDeactiveOpen(false);
    }
  }

  async function handleConfirmPopupActive() {
    try {
      await updateUserActive(usernameToConfirm, true);
      const updatedUserList = await getUserList();
      setUserList(updatedUserList);
      closePopup(1);
    } catch (e) {}
  }

  async function handleConfirmPopupDeactive() {
    try {
      await updateUserActive(usernameToConfirm, false);
      const updatedUserList = await getUserList();
      setUserList(updatedUserList);
      closePopup(2);
    } catch (e) {}
  }

  return (
    <div className="list-user-cont">
      <div className="sidebar-top"></div>
      <table id="customers">
        <tr className="list-column list-title">
          <td>Avatar</td>
          <td>Username</td>
          <td>FullName</td>
          <td>Address</td>
          <td>Email</td>
          <td>Gender</td>
          <td className="text-center">Action</td>
          <td className="text-center">Active</td>
        </tr>
        {userList.length !== 0 ? (
          userList.map((user, index) => (
            <tr key={index} className="list-column">
              <td>
                <img className="img-Cus" src={user.urlImg} alt="User Img" />
              </td>
              <td className="font-bolt">{user.username}</td>
              <td>{user.fullName === '' ? emptyCell : user.fullName}</td>
              <td>{user.address === '' ? emptyCell : user.address}</td>
              <td>{user.email === '' ? emptyCell : user.email}</td>
              <td>{user.gender === '' ? emptyCell : user.gender}</td>
              <td>
                <div className="action-cont">
                  <button onClick={() => handleEditInfo(user.username)} className="btn edit-btn">
                    Edit
                  </button>
                  {user.isActive === 1 ? (
                    <button
                      onClick={() => openPopup({ username: user.username, type: 2 })}
                      className="btn deactive-btn"
                    >
                      Deactive
                    </button>
                  ) : (
                    <button onClick={() => openPopup({ username: user.username, type: 1 })} className="btn active-btn">
                      Active
                    </button>
                  )}
                </div>
              </td>
              <td>
                <span className={`dot ${user.isActive === 1 ? 'active' : 'deactive'}`}></span>
              </td>
            </tr>
          ))
        ) : (
          <tr className="list-msg">
            <td colSpan="6">
              <span>{noUsersMsg}</span>
            </td>
          </tr>
        )}
      </table>

      {isPopupActiveOpen && (
        <ConfirmationPopup
          message={msgConfirmEnable}
          onConfirm={handleConfirmPopupActive}
          onCancel={() => closePopup(1)}
        />
      )}

      {isPopupDeactiveOpen && (
        <ConfirmationPopup
          message={msgConfirmDisable}
          onConfirm={handleConfirmPopupDeactive}
          onCancel={() => closePopup(2)}
        />
      )}
    </div>
  );
}
export default AdminPage;
