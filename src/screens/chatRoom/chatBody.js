import React, { useState, useEffect, useRef } from 'react';
import { setLoadingMsg } from '../../actions/config';
import { useDispatch, useSelector } from 'react-redux'; // Thêm useSelector
import { getMsgData, getMoreMsg } from '../../db/messageDTO';
import LoadingMsg from '../loading/loadingMsg';
const msgLength = 10;

function ChatBody(props) {
  const { roomChatID, currentUser } = props;
  const dispatch = useDispatch();
  const [msgList, setMsgList] = useState([]);
  const scrollBottom = useRef(null);
  const ulRef = useRef(null);
  const msgLengthRef = useRef(null);
  const username = currentUser?.username || '';
  const loadingMsg = useSelector((state) => state.configReducer.loadingMsg);

  useEffect(() => {
    getMsgData(
      (sortedMsg) => {
        setMsgList(sortedMsg);
        props.setScrollBarStatus(true);
      },
      roomChatID,
      msgLength
    );
  }, [roomChatID]);

  useEffect(() => {
    const handleScroll = async () => {
      if (ulRef.current.scrollTop === 0) {
        dispatch(setLoadingMsg(true));
        props.setScrollDown(true);
        setTimeout(async () => {
          try {
            await getMoreMsg(
              (sortedMsg) => {
                setMsgList((prevMsgList) => [...sortedMsg, ...prevMsgList]);
              },
              roomChatID,
              msgLength,
              msgList[0]?.created
            );
          } catch (error) {
            console.error('Error fetching more messages:', error);
          } finally {
            dispatch(setLoadingMsg(false));
          }
        }, 1000);
      }
    };
    scrollToLatestMsg(msgLengthRef);

    if (ulRef.current) {
      ulRef.current.addEventListener('scroll', handleScroll);
    }

    return () => {
      if (ulRef.current) {
        ulRef.current.removeEventListener('scroll', handleScroll);
      }
    };
  }, [dispatch, msgList[0]?.created, roomChatID]);

  const scrollToLatestMsg = (tag) => {
    if (tag.current) {
      tag.current.scrollIntoView({ block: 'end' });
    }
  };

  useEffect(() => {
    if (props.scrollBarStatus === true) {
      scrollToLatestMsg(scrollBottom);
      props.setScrollBarStatus(false);
    }
  }, [props.scrollBarStatus]);

  return (
    <ul className="chat-show-msg" ref={ulRef}>
      {loadingMsg && <LoadingMsg />}
      {msgList.map((msg, index) => (
        <li
          key={`msg${index}`}
          className={username === msg.username ? 'user-msg user-msg-right' : 'user-msg'}
          ref={index === msgLength + 5 ? msgLengthRef : null}
        >
          <img className="user-avatar-msg" src={msg.avatar} alt="" />
          <div>
            <p className="user-msg-name">{msg.displayName}</p>
            <p className="user-msg-content">{msg.msg}</p>
          </div>
        </li>
      ))}

      <span ref={scrollBottom}></span>
    </ul>
  );
}

export default ChatBody;
