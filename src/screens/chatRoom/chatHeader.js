import './index.css';
import { useState, useEffect } from 'react';
import { updateRoomChatMod, updateRoomChatName, addMoreMembers, getMembersChatRoom } from '../../db/groupMsgDTO';
import { searchUsersByEmail } from '../../db/userDTO';
import { IoMdPersonAdd } from 'react-icons/io';
import { CiEdit } from 'react-icons/ci';
import { IoCheckmark } from 'react-icons/io5';
import { CiCircleRemove } from 'react-icons/ci';

function ChatHeader(props) {
  const [chatNameInput, setChatNameInput] = useState('');
  const [userSearched, setUserSearched] = useState([]);
  const [invitePopUp, setInvitePopUp] = useState(false);
  const [membersInfo, setMembersInfo] = useState([]);
  const [membersInChatRoom, setMembersInChatRoom] = useState([]);

  const editRoomChatName = () => {
    if (chatNameInput === '') {
      alert('Enter Chat Room Name');
    } else {
      updateRoomChatName(props.roomChatID, chatNameInput);
      updateRoomChatMod(props.roomChatID);
    }
  };
  const handleSelectedMember = (newMember) => {
    const isMemberAdd = membersInfo.some((member) => member.email === newMember.email);
    if (!isMemberAdd) {
      setMembersInfo([...membersInfo, newMember]);
    }
  };
  const handleRemoveMember = (memberToRemove) => {
    const updatedMembersInfo = membersInfo.filter((member) => member.email !== memberToRemove.email);
    setMembersInfo(updatedMembersInfo);
  };

  useEffect(() => {
    let timer;
    let membersInRoom = [];
    if (membersInChatRoom && membersInChatRoom.length > 0 && membersInChatRoom[0].members) {
      membersInRoom = [...membersInChatRoom[0].members, ...membersInfo.map((member) => member.uID)];
    }
    if (props.userEmailInput !== null && props.userEmailInput !== '') {
      timer = setTimeout(() => {
        searchUsersByEmail(
          (sortedMsg) => {
            setUserSearched(sortedMsg);
          },
          props.userEmailInput,
          membersInRoom
        );
      }, 1000);
    } else {
      setUserSearched([]);
    }
    return () => {
      clearTimeout(timer);
    };
  }, [props.userEmailInput, membersInChatRoom, membersInfo]);

  useEffect(() => {
    getMembersChatRoom((sortedMsg) => {
      setMembersInChatRoom(sortedMsg);
    }, props.roomChatID);
  }, [props.roomChatID]);

  return (
    <div className="chat-header">
      <div className="chat-room-name">
        {props.chatRoomName === false ? (
          <p className="chat-room-name-title">{props.roomChatName}</p>
        ) : (
          <input
            type="text"
            className="chat-room-name-input"
            value={chatNameInput}
            onChange={(e) => {
              setChatNameInput(e.target.value);
            }}
          ></input>
        )}
        {props.chatRoomName === false ? (
          <button
            className="chat-room-name-icon"
            onClick={() => {
              props.setChatRoomName(true);
            }}
          >
            <CiEdit className="chat-name-icon-img"></CiEdit>
          </button>
        ) : (
          <button
            className="chat-room-name-icon"
            onClick={() => {
              editRoomChatName();
              props.setChatRoomName(false);
              setChatNameInput('');
            }}
          >
            <IoCheckmark className="chat-name-icon-img"></IoCheckmark>
          </button>
        )}
      </div>
      <div className="chat-option">
        <button
          className="chat-option-invite"
          onClick={() => {
            setInvitePopUp(true);
          }}
        >
          <IoMdPersonAdd className="option-invite-icon"></IoMdPersonAdd>
        </button>
        {/* <ul className="chat-option-avatar">
          <li className="option-avatar-item">
            <img src="https://tse4.mm.bing.net/th?id=OIP.KGdLPsiqGjKqCYuhzhmmWgAAAA&pid=Api&P=0&h=180" alt="" />
          </li>
          <li className="option-avatar-item">
            <img src="https://tse2.explicit.bing.net/th?id=OIP.AbGafkazjc_S1pZPh0B9cQHaIm&pid=Api&P=0&h=180" alt="" />
          </li>
          <li className="option-avatar-item">
            <img src="https://tse4.mm.bing.net/th?id=OIP.t2SLOkNOQ6aX3KudURBVlwHaHa&pid=Api&P=0&h=180" alt="" />
          </li>
        </ul> */}
      </div>
      {invitePopUp === true && (
        <div
          className="invite-member-popup"
          onClick={() => {
            props.setUserEmailInput(null);
            setUserSearched([]);
            setInvitePopUp(false);
          }}
        >
          <div
            className="invite-member-popup-cont"
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            <div className="invite-member-popup-title">Invite member</div>
            <div className="invite-member-popup-form">
              <input
                type="text"
                placeholder="Name"
                className="invite-member-popup-search"
                value={props.userEmailInput}
                onChange={(e) => {
                  props.setUserEmailInput(e.target.value);
                }}
              />
              <ul className="invite-member-popup-options">
                {userSearched.map((user, index) => (
                  <li
                    className="new-slect-member"
                    key={`user${index}searched`}
                    onClick={() => {
                      handleSelectedMember(user);
                      props.setUserEmailInput('');
                      setUserSearched([]);
                    }}
                  >
                    <img className="invite-member-avatar" alt="" src={user.urlImg}></img>
                    <p>{user.email}</p>
                  </li>
                ))}
              </ul>
              <ul className="invite-member-selected-cont">
                {membersInfo.map((members) => (
                  <li className="invite-member-selected" onClick={() => {}}>
                    <button
                      className="invite-member-selected-remove"
                      onClick={() => {
                        handleRemoveMember(members);
                      }}
                    >
                      <CiCircleRemove className="invite-member-remove-icon"></CiCircleRemove>
                    </button>
                    <img className="invite-member-avatar" alt="" src={members.urlImg}></img>
                    <p className="invite-member-selected-name">{members.fullName}</p>
                  </li>
                ))}
              </ul>
            </div>
            <div className="invite-member-popup-submit">
              <button
                className="invite-member-popup-cancel"
                onClick={() => {
                  setMembersInfo([]);
                  props.setUserEmailInput('');
                  setInvitePopUp(false);
                }}
              >
                Cancel
              </button>
              <button
                className="invite-member-popup-invite"
                onClick={() => {
                  addMoreMembers(props.roomChatID, membersInfo);
                  updateRoomChatMod(props.roomChatID);
                  setMembersInfo([]);
                  setInvitePopUp(false);
                }}
              >
                Add
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ChatHeader;
