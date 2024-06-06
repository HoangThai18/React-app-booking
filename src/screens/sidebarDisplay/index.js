import './index.css';
import ConfirmationPopup from '../../components/confirmPopup';
import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getRoomByCateID, updateRoomData, updateRoomStatus } from '../../db/roomsDTO';
import { getRoomsLikedByUser, unLikeRoom, addNewLike, listLikes } from '../../db/likesDTO';
import { GoHeartFill } from 'react-icons/go';
import { setLoading } from '../../actions/config';
import { GiSightDisabled } from 'react-icons/gi';
import { FaEye } from 'react-icons/fa';
import { RiEdit2Line } from 'react-icons/ri';
import { setCurrentRoom } from '../../actions/room';
const roomIcon = 'room-item-love-focus';
const hiddenImg = 'hidden-img';
const showImg = 'show-img';
const disableRoom = 'disable-room';

const msgConfirmDisable = 'You will disable the active state for this room';
const userRole = {
  MOD: 3,
  ADMIN: 2,
  NORMAL_USER: 1,
};

function SideBarDisplay(props) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const users = useSelector((state) => state.userReducer);
  const [roomIDs] = useState([]);
  const [roomByCateId, setRoomByCateId] = useState([]);
  const [updateProduct, setUpdateProduct] = useState(false);
  const [formData, setFormData] = useState({});
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [roomIdToConfirm, setRoomIdToConfirm] = useState('');
  const [imageLoaded, setImageLoaded] = useState([]);
  const [roomLiked, setRoomLiked] = useState([]);
  const [likeRoomID, setLikeRoomID] = useState(null);
  const [unLikeRoomID, setUnLikeRoomID] = useState(null);
  const [likesCountMap, setLikesCountMap] = useState([]);

  const userRoleStatus = users.currentUser?.role || '';
  const username = users.currentUser?.username || '';
  const avatar = users.currentUser?.urlImg || '';
  const fullName = users.currentUser?.fullName || '';

  function goToDetail() {
    navigate('/detail');
  }
  async function getRoomsByCtgId(id) {
    try {
      const roomByCateId = await getRoomByCateID(id);
      setImageLoaded(Array(roomByCateId.length).fill(false));
      setRoomByCateId(roomByCateId);
    } catch (error) {}
  }

  async function getRoomsLikedList(username) {
    try {
      const roomLiked = await getRoomsLikedByUser(username);
      setRoomLiked(roomLiked);
    } catch (error) {}
  }
  useEffect(() => {
    async function fetchDataAndHandleLoading() {
      try {
        dispatch(setLoading(true));
        await getRoomsByCtgId(props.newid);
        await getRoomsLikedList(username);
      } catch (e) {
      } finally {
        dispatch(setLoading(false));
      }
    }
    fetchDataAndHandleLoading();
  }, [dispatch, props.newid, username]);

  const countLikesForRooms = async (roomByCateId) => {
    try {
      const likeCountArr = [];
      for (const room of roomByCateId) {
        const roomCount = await listLikes(room.id);
        likeCountArr.push({ roomID: room.id, countRoomData: roomCount });
      }
      setLikesCountMap(likeCountArr);
    } catch (error) {}
  };

  useEffect(() => {
    countLikesForRooms(roomByCateId);
  }, [roomByCateId]);

  useEffect(() => {
    addLike(
      likeRoomID,
      unLikeRoomID,
      username,
      avatar,
      fullName,
      setLikeRoomID,
      unLikeRoom,
      addNewLike,
      getRoomsLikedList
    );
  }, [likeRoomID, username, avatar, fullName]);

  useEffect(() => {
    unLike(unLikeRoomID, username, unLikeRoom, getRoomsLikedList);
  }, [unLikeRoomID, username]);

  const addLike = async (
    likeRoomID,
    unLikeRoomID,
    username,
    avatar,
    fullName,
    setLikeRoomID,
    unLikeRoom,
    addNewLike,
    getRoomsLikedList
  ) => {
    if (likeRoomID !== null) {
      try {
        dispatch(setLoading(true));
        const newLike = {
          roomID: likeRoomID,
          user: {
            username: username,
            avatar: avatar,
            displayName: fullName,
          },
          status: 1,
          created: Date.now(),
          createdBy: username,
          modified: Date.now(),
          modifiedBy: username,
        };
        await unLikeRoom(unLikeRoomID, username);
        await addNewLike(newLike);
        await getRoomsLikedList(username);
        dispatch(setLoading(false));
      } catch (e) {}
      setLikeRoomID(null);
    }
  };
  const unLike = async (unLikeRoomID, username, unLikeRoom, getRoomsLikedList) => {
    if (unLikeRoomID !== null) {
      try {
        dispatch(setLoading(true));
        await unLikeRoom(unLikeRoomID, username);
        await getRoomsLikedList(username);
        dispatch(setLoading(false));
      } catch (e) {}
      setUnLikeRoomID(null);
    }
  };

  function handleInputChange(e) {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      if (
        formData.categoryID.length === 0 ||
        !formData.date ||
        !formData.describe ||
        !formData.place ||
        !formData.price
      ) {
        alert('Please fill in all required fields.');
        return;
      }

      await updateRoomData(formData.id, formData);
      const roomInfo = await getRoomByCateID(props.newid);
      setRoomByCateId(roomInfo);
      alert('Update success!');
      setUpdateProduct(!updateProduct);
    } catch (ex) {
      return false;
    }
  }

  async function handleConfirmPopupDisable(status) {
    try {
      await updateRoomStatus(roomIdToConfirm, status);
      const rooms = await getRoomByCateID(props.newid);
      setRoomByCateId(rooms);
    } catch (e) {}
  }
  return (
    <>
      {userRoleStatus === userRole.NORMAL_USER && (
        <div className="cus-sidebar-content-display">
          <div className="room-items">
            {roomByCateId &&
              roomByCateId.map((room, index) => (
                <div key={roomIDs[index]}>
                  {room?.data?.status === 1 && (
                    <div
                      className="room-item"
                      onClick={() => {
                        dispatch(setCurrentRoom(roomByCateId.find((element) => element.id === room.id)));
                        goToDetail();
                      }}
                    >
                      <div
                        className="room-item-top"
                        onClick={(e) => {
                          e.stopPropagation();
                        }}
                      >
                        {roomLiked &&
                        roomLiked.some &&
                        roomLiked.some((liked) => liked.roomID === room.id && liked.status === 1) ? (
                          <GoHeartFill
                            className={`room-item-love ${roomIcon}`}
                            onClick={() => {
                              setUnLikeRoomID(room.id);
                            }}
                          ></GoHeartFill>
                        ) : (
                          <GoHeartFill
                            className={'room-item-love'}
                            onClick={() => {
                              setLikeRoomID(room.id);
                            }}
                          ></GoHeartFill>
                        )}
                      </div>
                      {imageLoaded[index] === false && (
                        <img
                          className={`room-item-img ${imageLoaded[index] === false ? '' : showImg}`}
                          src={require('../../resources/images/image_loading.gif')}
                          alt={roomIDs[index]}
                        />
                      )}
                      <img
                        key={room.id}
                        className={`room-item-img ${imageLoaded[index] === true ? showImg : hiddenImg}`}
                        src={room.imgs[0].data.src && room.imgs[0].data.src}
                        alt={roomIDs[index]}
                        onClick={() => {}}
                        onLoad={() => {
                          setImageLoaded((prevImageLoaded) => {
                            const newArr = [...prevImageLoaded];
                            newArr[index] = true;
                            return newArr;
                          });
                        }}
                      />
                      <div className="room-item-content" onClick={() => {}}>
                        <p className="my-room-item-place">Place: {room?.data.place}</p>
                        <p className="my-room-item-des">Describe: {room?.data.describe}</p>
                        <p className="my-room-item-date">Check-in date: {room?.data.date}</p>
                        <p className="my-room-item-price">
                          Price: <span>{room?.data.price}$</span> / Month
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              ))}
          </div>
        </div>
      )}
      {userRoleStatus === userRole.ADMIN && (
        <div className="cus-sidebar-content-display">
          <div className="room-items">
            {roomByCateId &&
              roomByCateId.map((room, index) => (
                <div
                  key={roomIDs[index]}
                  className={`${room?.data?.status === 0 && disableRoom} room-item`}
                  onClick={() => {
                    goToDetail();
                  }}
                >
                  <div className="room-top-background">
                    <div
                      className="room-top-hover"
                      onClick={(e) => {
                        e.stopPropagation();
                        dispatch(setCurrentRoom(roomByCateId.find((element) => element.id === room.id)));
                        goToDetail();
                      }}
                    >
                      <div className="room-item-top">
                        <div
                          className="like-room-display"
                          onClick={(e) => {
                            e.stopPropagation();
                          }}
                        >
                          <div>
                            <GoHeartFill className={`room-item-love room-item-love-focus`}></GoHeartFill>
                            <p className="count-liked" key={index}>
                              {likesCountMap.find((like) => like.roomID === room.id)?.countRoomData?.usersLiked.length}
                            </p>
                          </div>
                          <ul className="liked-user-avatar">
                            {likesCountMap
                              .find((like) => like.roomID === room.id)
                              ?.countRoomData?.usersLiked.map((userLiked, idx) => (
                                <li className="liked-avatar" key={idx}>
                                  <img className="liked-avatar-img" src={userLiked.user.avatar || ' '} alt=""></img>
                                </li>
                              ))}
                            {likesCountMap.find((like) => like.roomID === room.id)?.countRoomData?.usersLiked.length >
                              3 && (
                              <li className="liked-avatar">
                                <p>...</p>
                              </li>
                            )}
                          </ul>
                        </div>
                        <div className="room-item-edit">
                          <button
                            className="room-item-edit-btn"
                            onClick={(e) => {
                              e.stopPropagation();
                              setUpdateProduct(!updateProduct);
                              setFormData({ ...room?.data });
                            }}
                          >
                            <RiEdit2Line></RiEdit2Line>
                          </button>
                          {room?.data?.status === 1 && (
                            <p
                              className="room-item-edit-btn"
                              onClick={(e) => {
                                e.stopPropagation();
                                setIsPopupOpen(true);
                                setRoomIdToConfirm(room?.data?.id);
                              }}
                            >
                              <GiSightDisabled></GiSightDisabled>
                            </p>
                          )}
                          {room?.data?.status === 0 && (
                            <p
                              onClick={(e) => {
                                e.stopPropagation();
                                setRoomIdToConfirm(room?.data?.id);
                                handleConfirmPopupDisable(true);
                              }}
                              className="room-item-edit-btn"
                            >
                              <FaEye></FaEye>
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                    <img
                      key={roomByCateId.id}
                      className="room-item-img"
                      src={room.imgs[0].data.src}
                      alt={roomIDs[index]}
                    />
                  </div>
                  <div className="room-item-content" onClick={() => {}}>
                    <p className="my-room-item-place">Place: {room?.data.place}</p>
                    <p className="my-room-item-des">Describe: {room?.data.describe}</p>
                    <p className="my-room-item-date">Check-in date: {room?.data.date}</p>
                    <p className="my-room-item-price">
                      Price: <span>{room?.data.price}$</span> / Month
                    </p>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}
      {userRoleStatus === userRole.MOD && (
        <div className="cus-sidebar-content-display">
          <div
            className="room-items"
            onClick={() => {
              goToDetail();
            }}
          >
            {roomByCateId &&
              roomByCateId.map((room, index) => (
                <>
                  {room?.data?.status === 1 && (
                    <div
                      key={roomIDs[index]}
                      className={`${room?.data?.status === 0 && disableRoom} room-item`}
                      onClick={() => {
                        goToDetail();
                      }}
                    >
                      <div className="room-top-background">
                        <div
                          className="room-top-hover"
                          onClick={(e) => {
                            e.stopPropagation();
                            dispatch(setCurrentRoom(roomByCateId.find((element) => element.id === room.id)));
                            goToDetail();
                          }}
                        >
                          <div className="room-item-top">
                            <div
                              className="like-room-display"
                              onClick={(e) => {
                                e.stopPropagation();
                              }}
                            >
                              <div>
                                <GoHeartFill className={`room-item-love room-item-love-focus`}></GoHeartFill>
                                <p className="count-liked" key={index}>
                                  {
                                    likesCountMap.find((like) => like.roomID === room.id)?.countRoomData?.usersLiked
                                      .length
                                  }
                                </p>
                              </div>
                              <ul className="liked-user-avatar">
                                <li className="liked-avatar">
                                  <img
                                    className="liked-avatar-img"
                                    src={
                                      likesCountMap.find((like) => like.roomID === room.id)?.countRoomData
                                        ?.usersLiked[0]?.user?.avatar || ' '
                                    }
                                    alt=""
                                  ></img>
                                </li>
                                <li className="liked-avatar">
                                  <img
                                    className="liked-avatar-img"
                                    src={
                                      likesCountMap.find((like) => like.roomID === room.id)?.countRoomData
                                        ?.usersLiked[1]?.user?.avatar || ' '
                                    }
                                    alt=""
                                  ></img>
                                </li>
                                <li className="liked-avatar">
                                  <img
                                    className="liked-avatar-img"
                                    src={
                                      likesCountMap.find((like) => like.roomID === room.id)?.countRoomData
                                        ?.usersLiked[2]?.user?.avatar || ' '
                                    }
                                    alt=""
                                  ></img>
                                </li>
                                {likesCountMap.find((like) => like.roomID === room.id)?.countRoomData?.usersLiked
                                  .length > 3 && (
                                  <li className="liked-avatar">
                                    <p>...</p>
                                  </li>
                                )}
                              </ul>
                            </div>
                          </div>
                        </div>
                        <img
                          key={roomByCateId.id}
                          className="room-item-img"
                          src={room.imgs[0].data.src}
                          alt={roomIDs[index]}
                        />
                      </div>
                      <div className="room-item-content" onClick={() => {}}>
                        <p className="my-room-item-place">Place: {room?.data.place}</p>
                        <p className="my-room-item-des">Describe: {room?.data.describe}</p>
                        <p className="my-room-item-date">Check-in date: {room?.data.date}</p>
                        <p className="my-room-item-price">
                          Price: <span>{room?.data.price}$</span> / Month
                        </p>
                      </div>
                    </div>
                  )}
                </>
              ))}
          </div>
        </div>
      )}

      {updateProduct === true && (
        <div className="update-product-form">
          <div className="update-product-cont">
            <p className="update-product-title">Update House</p>
            <form className="update-product-info">
              <div className="input-group">
                <input
                  required
                  id="date"
                  name="date"
                  className={`input-input`}
                  type="date"
                  placeholder=""
                  value={formData.date}
                  onChange={handleInputChange}
                  autoComplete="on"
                ></input>
                <label htmlFor="date" className={`add-date-room-label`}>
                  Date
                </label>
              </div>
              <div className="input-group">
                <input
                  required
                  id="place"
                  name="place"
                  className={`input-input`}
                  type="text"
                  placeholder=""
                  value={formData.place}
                  onChange={handleInputChange}
                  autoComplete="on"
                ></input>
                <label htmlFor="place" className={`input-label`}>
                  Place
                </label>
              </div>
              <div className="input-group">
                <input
                  required
                  id="price"
                  name="price"
                  className={`input-input`}
                  type="text"
                  placeholder=""
                  value={formData.price}
                  onChange={handleInputChange}
                  autoComplete="on"
                ></input>
                <label htmlFor="price" className={`input-label`}>
                  Price
                </label>
              </div>
              <div className="input-group">
                <input
                  required
                  id="describe"
                  name="describe"
                  className={`input-input`}
                  type="text"
                  placeholder=""
                  value={formData.describe}
                  onChange={handleInputChange}
                  autoComplete="on"
                ></input>
                <label htmlFor="describe" className={`input-label`}>
                  Describe
                </label>
              </div>
              <div className="update-my-room-submit">
                <button
                  className="update-my-room-btn"
                  onClick={() => {
                    setUpdateProduct(!updateProduct);
                  }}
                >
                  Cancel
                </button>
                <button onClick={handleSubmit} className="update-my-room-btn my-room-submit-btn">
                  Completed
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isPopupOpen === true && (
        <ConfirmationPopup
          message={msgConfirmDisable}
          onConfirm={() => {
            handleConfirmPopupDisable(false);
          }}
          onCancel={() => {
            setIsPopupOpen(false);
          }}
        />
      )}
    </>
  );
}

export default SideBarDisplay;
