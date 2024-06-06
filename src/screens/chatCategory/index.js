import './index.css';
import { useState, useEffect } from 'react';
import { MdOutlineChat } from 'react-icons/md';
import { getChatRoom, addRoomChat } from '../../db/groupMsgDTO';
import { IoIosAddCircleOutline } from 'react-icons/io';

function ChatCategory(props) {
  const { roomChatID, setRoomChatID, currentUser, setRoomChatName, setChatRoomName } = props;
  const [chatCateList, setChatCateList] = useState([]);
  const [addChatRoomPopup, setAddChatRoomPopup] = useState(false);
  const [chatRoomNameInput, setChatRoomNameInput] = useState('');
  const [chatRoomSummaryInput, setChatRoomSummaryInput] = useState('');
  const username = currentUser?.username || '';
  const uID = currentUser?.uID || '';

  const handleAddRoomChat = async () => {
    const newData = {
      created: Date.now(),
      createdBy: username,
      groupName: chatRoomNameInput,
      members: [uID],
      modified: Date.now(),
      status: '',
      summary: chatRoomSummaryInput,
    };
    await addRoomChat(newData);
    setChatRoomNameInput('');
    setChatRoomSummaryInput('');
    setAddChatRoomPopup(false);
  };

  useEffect(() => {
    getChatRoom((cateData) => {
      setChatCateList(cateData);
      setRoomChatID(cateData[0]?.id);
      setRoomChatName(cateData[0]?.groupName);
    }, uID);
  }, []);
  return (
    <div className="chat-cate-top">
      <ul className="chat-category">
        {chatCateList.map((chatCate) => (
          <li
            key={chatCate.id}
            className={`chat-category-items ${roomChatID === chatCate.id ? 'selected-chat-category' : ''}  `}
            onClick={() => {
              setRoomChatID(chatCate.id);
              setRoomChatName(chatCate.groupName);
              setChatRoomName(false);
              props.setUserEmailInput('');
              props.setScrollDown(false);
            }}
          >
            <MdOutlineChat className="chat-category-icon"></MdOutlineChat>
            <p className="chat-category-title">{chatCate.groupName}</p>
          </li>
        ))}
      </ul>
      <IoIosAddCircleOutline
        className="add-room-chat"
        onClick={() => {
          setAddChatRoomPopup(true);
        }}
      ></IoIosAddCircleOutline>
      {addChatRoomPopup === true && (
        <div className="group-chat-popup">
          <div className="group-chat-cont">
            <p className="add-chat-room-title">New Chat Room</p>
            <div className="chat-room-form">
              <input
                required
                id="roomChatName"
                className={`chat-room-input`}
                type="text"
                placeholder=""
                value={chatRoomNameInput}
                onChange={(e) => setChatRoomNameInput(e.target.value)}
                autoComplete="roomChatName"
              ></input>
              <label htmlFor="roomChatName" className={`chat-room-label`}>
                Room Name
              </label>
            </div>
            <div className="chat-room-form">
              <input
                required
                id="roomSummary"
                className={`chat-room-input`}
                type="text"
                placeholder=""
                value={chatRoomSummaryInput}
                onChange={(e) => setChatRoomSummaryInput(e.target.value)}
                autoComplete="roomSummary"
              ></input>
              <label htmlFor="roomSummary" className={`chat-room-label`}>
                Summary
              </label>
            </div>
            <div className="add-chat-room-navigate">
              <button
                className="add-chat-room-btn add-chat-room-cancel"
                onClick={() => {
                  setAddChatRoomPopup(false);
                  setChatRoomNameInput('');
                  setChatRoomSummaryInput('');
                }}
              >
                Cancel
              </button>
              <button
                className="add-chat-room-btn add-chat-room-submit"
                onClick={() => {
                  handleAddRoomChat();
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

export default ChatCategory;
