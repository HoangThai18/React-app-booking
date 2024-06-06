import './index.css';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import ChatCategory from '../chatCategory';
import ChatHeader from './chatHeader';
import ChatBody from './chatBody';
import ChatSendMsg from './chatSendMsg';
import addNotification from 'react-push-notification';
import { FaArrowDown } from 'react-icons/fa';

function ChatRoom() {
  const navigate = useNavigate();
  const currentUser = useSelector((state) => state.userReducer).currentUser || '';
  const [roomChatID, setRoomChatID] = useState(undefined);
  const [msgSent, setMsgSent] = useState('');
  const [scrollBarStatus, setScrollBarStatus] = useState(false);
  const [scrollDown, setScrollDown] = useState(false);
  const [chatRoomName, setChatRoomName] = useState(false);
  const [roomChatName, setRoomChatName] = useState('');
  const [userEmailInput, setUserEmailInput] = useState(null);

  const nickName = (fullName) => {
    const wordsArray = fullName.split(' ');
    const lastName = wordsArray.pop();
    const firstName = wordsArray.shift();
    const result = lastName + ' ' + firstName;
    return result;
  };

  function goToUserHome() {
    navigate('/userHome');
  }

  const sentNoti = () => {
    addNotification({
      title: nickName(currentUser.fullName),
      message: msgSent,
      duration: 5000,
      icon: 'https://tse3.mm.bing.net/th?id=OIP.NIxPq3iP5TIB9AzuA47W9gHaCh&pid=Api&P=0&h=180',
      native: true,
      onClick: () => goToUserHome(),
    });
  };

  return (
    <div className="chat-display">
      <div className="chat-cont">
        <div className="chat-box-top">
          <ChatHeader
            roomChatName={roomChatName}
            roomChatID={roomChatID}
            chatRoomName={chatRoomName}
            userEmailInput={userEmailInput}
            setChatRoomName={setChatRoomName}
            setUserEmailInput={setUserEmailInput}
          ></ChatHeader>
          <ChatBody
            currentUser={currentUser}
            roomChatID={roomChatID}
            scrollBarStatus={scrollBarStatus}
            setScrollBarStatus={setScrollBarStatus}
            setScrollDown={setScrollDown}
          ></ChatBody>
          <div
            className="scroll-down"
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            {scrollDown === true && (
              <button
                className="scroll-down-btn"
                onClick={() => {
                  setScrollDown(false);
                  setScrollBarStatus(true);
                }}
              >
                <FaArrowDown></FaArrowDown>
              </button>
            )}
          </div>
        </div>
        <ChatSendMsg
          sentNoti={sentNoti}
          currentUser={currentUser}
          roomChatID={roomChatID}
          setMsgSent={setMsgSent}
        ></ChatSendMsg>
      </div>
      <ChatCategory
        roomChatID={roomChatID}
        currentUser={currentUser}
        setRoomChatID={setRoomChatID}
        setScrollDown={setScrollDown}
        setRoomChatName={setRoomChatName}
        setChatRoomName={setChatRoomName}
        setUserEmailInput={setUserEmailInput}
      ></ChatCategory>
    </div>
  );
}
export default ChatRoom;
