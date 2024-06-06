import './index.css';
import { GiPlayButton } from 'react-icons/gi';
import { useState } from 'react';
import { addNewMsg } from '../../db/messageDTO';
import { updateRoomChatMod } from '../../db/groupMsgDTO';

function ChatSendMsg(props) {
  const currentUser = props.currentUser || '';
  const { username = '', urlImg = '', fullName = '' } = currentUser;
  const [msgInput, setMsgInput] = useState('');

  const nickName = (fullName) => {
    const wordsArray = fullName.split(' ');
    const lastName = wordsArray.pop();
    const firstName = wordsArray.shift();
    const result = lastName + ' ' + firstName;
    return result;
  };

  const sendMsg = async (e) => {
    updateRoomChatMod(props.roomChatID);
    e.preventDefault();
    if (msgInput.trim() === '') {
      alert('Enter valid message');
      return;
    }

    const newMsg = {
      username: username,
      avatar: urlImg,
      displayName: nickName(fullName),
      status: 1,
      created: Date.now(),
      createdBy: username,
      modified: Date.now(),
      modifiedBy: username,
      msg: msgInput.trim(),
      chatRoomID: props.roomChatID,
    };

    await addNewMsg(newMsg);
    setMsgInput('');
  };

  return (
    <form onSubmit={(e) => sendMsg(e)} className="chat-sent-msg">
      <input
        type="text"
        className="chat-input"
        placeholder="New message..."
        value={msgInput}
        onChange={(e) => setMsgInput(e.target.value)}
      ></input>
      <button
        type="submit"
        className="chat-sent-btn"
        onClick={() => {
          props.setMsgSent(msgInput);
        }}
      >
        <GiPlayButton className="chat-sent-icon"></GiPlayButton>
      </button>
    </form>
  );
}

export default ChatSendMsg;
