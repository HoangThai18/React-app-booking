import './index.css';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { getRoomOwner, updateRoomData, updateRoomStatus } from '../../db/roomsDTO';
import { GoHeartFill } from 'react-icons/go';
import { GiSightDisabled } from 'react-icons/gi';
import { FaEye, FaRegListAlt } from 'react-icons/fa';
import { FaRegMoneyBill1 } from 'react-icons/fa6';
import { RiEdit2Line } from 'react-icons/ri';
import { addRoomArea } from '../../db/roomsDTO';
import { useDispatch } from 'react-redux';
import { setLoading } from '../../actions/config';
import { MdOutlineAddCircleOutline } from 'react-icons/md';
import { setCurrentRoom } from '../../actions/room';
import ConfirmationPopup from '../../components/confirmPopup';
import Renters from '../renters';
import RoomBill from '../roomBill';

const disableMyRoom = 'disable-my-room';
const msgConfirmDisable = 'You will disable the active state for this room';
const roomInfoChild = {
  address: '',
  des: '',
  electricity: '',
  garbage: '',
  name: '',
  security: '',
  water: '',
};
const defaulObj = {
  urlImage: '',
  date: '',
  describe: '',
  id: '',
  place: '',
  price: '',
  roomInfo: roomInfoChild,
};
function MyRooms(props) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const users = useSelector((state) => state.userReducer.currentUser);
  const [ownerListRooms, setOwnerListRooms] = useState([]);
  const [updateMyRoom, setUpdateMyRoom] = useState(false);
  const [isDisablePopup, setIsDisablePopup] = useState(false);
  const [addRoom, setAddRoom] = useState(false);
  const [isRenters, setIsRenters] = useState(false);
  const [isRoomBill, setIsRoomBill] = useState(false);
  const [roomID, setRoomID] = useState();
  const [selectedMyRoom, setsSelectedMyRoom] = useState({});
  const [roomData, setRoomData] = useState({});
  const [roomUpdate, setRoomUpdate] = useState({});
  const [roomInfoChildren, setRoomInfoChildren] = useState(roomInfoChild);

  const username = users?.username || '';

  function goToDetail() {
    navigate('/detail');
  }

  async function fetchOwnerRooms(username, cateID) {
    try {
      const rooms = await getRoomOwner(username, cateID);
      setOwnerListRooms(rooms);
    } catch (error) {}
  }

  function handleInputChangeChild(e) {
    const { name, value } = e.target;
    setRoomInfoChildren({
      ...roomInfoChildren,
      [name]: value,
    });
  }
  function handleInputChangeAdd(e) {
    const { name, value } = e.target;
    setRoomData({
      ...roomData,
      [name]: value,
    });
  }
  async function handleSubmitAdd(e) {
    e.preventDefault();
    const priceRegex = /^[1-9]\d*$/;
    if (
      roomData.urlImage === '' &&
      roomData.date === '' &&
      roomData.place === '' &&
      roomData.price === '' &&
      roomData.describe === '' &&
      roomData.roomInfo.des === '' &&
      roomData.roomInfo.name === '' &&
      roomData.roomInfo.address === ''
    ) {
      alert('Vui lòng điền đầy đủ thông tin');
    } else if (!priceRegex.test(roomData.price)) {
      alert('Vui lòng nhập giá phòng là số lớn hơn 0');
    } else {
      let categoryID;
      if (roomData.price > 0) {
        categoryID = props.newid;
      }
      const dateNow = Date.now();
      const newRoomArea = {
        urlImage: { src: roomData.urlImage, created: dateNow, modified: dateNow },
        infoRoom: {
          date: roomData.date,
          describe: roomData.describe,
          id: '',
          status: 1,
          place: roomData.place,
          price: roomData.price,
          categoryID: [categoryID],
          roomInfo: {
            address: roomInfoChildren.address,
            des: roomInfoChildren.des,
            electricity: 0,
            garbage: 0,
            name: roomInfoChildren.name,
            security: 0,
            water: 0,
          },
          createdBy: username,
          created: dateNow,
          modified: dateNow,
          modifiedBy: '',
          roomsList: [],
        },
      };
      const createRoomArea = await addRoomArea(newRoomArea);
      if (createRoomArea === true) {
        dispatch(setLoading(true));

        setTimeout(() => {
          dispatch(setLoading(false));
          setAddRoom(!addRoom);
          setRoomData(defaulObj);
          setRoomInfoChildren(roomInfoChild);
          alert('Add Room Success!');
        }, 500);
      } else {
        alert('Add Room Failed!');
      }
      await fetchOwnerRooms(users?.username, props.newid);
    }
  }

  useEffect(() => {
    fetchOwnerRooms(users?.username, props.newid);
  }, [users?.username, props.newid]);

  function handleInputChange(e) {
    const { name, value } = e.target;
    setRoomUpdate({
      ...roomUpdate,
      [name]: value,
    });
  }

  async function handleSubmit(username) {
    try {
      if (!roomUpdate.date || !roomUpdate.describe || !roomUpdate.place || !roomUpdate.price) {
        alert('Please fill in all required fields.');
        return;
      }

      await updateRoomData(roomID, roomUpdate);
      const listRoom = await getRoomOwner(username);
      setOwnerListRooms(listRoom);
      alert('Update success!');
      setUpdateMyRoom(false);
    } catch (ex) {
      return false;
    }
  }
  async function handleDisableRoom(status) {
    try {
      await updateRoomStatus(roomID, status);
      fetchOwnerRooms(users?.username, props.newid);
    } catch (e) {}
  }

  return (
    <div className="my-room-layout">
      <div className="my-room-items">
        {ownerListRooms?.map((room, index) => (
          <div
            className={`my-room-item ${room?.data?.status === 0 ? disableMyRoom : ''}`}
            key={`roomOwner${index}`}
            onClick={() => {
              goToDetail();
            }}
          >
            <div className="my-room-item-top">
              <GoHeartFill className={`my-room-item-love`}></GoHeartFill>
            </div>

            <div className="room-top-background">
              <div
                className="room-top-hover"
                onClick={(e) => {
                  e.stopPropagation();
                  dispatch(setCurrentRoom(ownerListRooms.find((element) => element.data.id === room.data.id)));
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
                    </div>
                  </div>
                  <div
                    className="room-item-edit"
                    onClick={(e) => {
                      e.stopPropagation();
                      setRoomID(room?.data?.id);
                    }}
                  >
                    <button
                      className="room-item-edit-btn"
                      onClick={() => {
                        setsSelectedMyRoom(ownerListRooms[index]);
                        setIsRenters(true);
                      }}
                    >
                      <FaRegListAlt></FaRegListAlt>
                    </button>
                    <button
                      className="room-item-edit-btn"
                      onClick={() => {
                        setsSelectedMyRoom(ownerListRooms[index]);
                        setIsRoomBill(true);
                      }}
                    >
                      <FaRegMoneyBill1></FaRegMoneyBill1>
                    </button>
                    <button
                      className="room-item-edit-btn"
                      onClick={() => {
                        setUpdateMyRoom(true);
                        setRoomUpdate({ ...room?.data });
                      }}
                    >
                      <RiEdit2Line></RiEdit2Line>
                    </button>
                    {room?.data?.status === 1 && (
                      <p
                        className="room-item-edit-btn"
                        onClick={() => {
                          setRoomID(room?.data?.id);
                          setIsDisablePopup(true);
                        }}
                      >
                        <GiSightDisabled></GiSightDisabled>
                      </p>
                    )}
                    {room?.data?.status === 0 && (
                      <p
                        className="room-item-edit-btn"
                        onClick={() => {
                          setRoomID(room?.data?.id);
                          handleDisableRoom(true);
                        }}
                      >
                        <FaEye></FaEye>
                      </p>
                    )}
                  </div>
                </div>
              </div>
              <img className={`my-room-item-img`} src={room.imgs[0].data.src} alt={'roomIDs[index]'} />
            </div>
            <div className="my-room-item-content">
              <p className="my-room-item-place">Place: {room?.data.place}</p>
              <p className="my-room-item-des">Describe: {room?.data.describe}</p>
              <p className="my-room-item-date">Check-in date: {room?.data.date}</p>
              <p className="my-room-item-price">
                Price: <span>{room?.data.price}$</span> / Month
              </p>
            </div>
          </div>
        ))}
        <div
          className="add-room-item my-room-item"
          onClick={(e) => {
            e.stopPropagation();
            setAddRoom(!addRoom);
          }}
        >
          <MdOutlineAddCircleOutline className="icon-add" />
        </div>
      </div>
      {isRenters === true && <Renters selectedMyRoom={selectedMyRoom} setIsRenters={setIsRenters}></Renters>}
      {isRoomBill === true && <RoomBill selectedMyRoom={selectedMyRoom} setIsRoomBill={setIsRoomBill}></RoomBill>}
      {updateMyRoom === true && (
        <div className="update-my-room-layout">
          <div className="update-my-room-cont">
            <p className="update-my-room-title">Update My House</p>
            <form className="update-my-room-form">
              <div className="input-group">
                <input
                  required
                  id="date"
                  name="date"
                  className={`input-input`}
                  type="date"
                  placeholder=""
                  value={roomUpdate.date}
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
                  value={roomUpdate.place}
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
                  value={roomUpdate.price}
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
                  value={roomUpdate.describe}
                  onChange={handleInputChange}
                  autoComplete="on"
                ></input>
                <label htmlFor="describe" className={`input-label`}>
                  Describe
                </label>
              </div>
              <div className="update-my-room-submit">
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    setUpdateMyRoom(false);
                  }}
                  className="update-my-room-btn"
                >
                  Cancel
                </button>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    handleSubmit(users?.username);
                  }}
                  className="update-my-room-btn my-room-submit-btn"
                >
                  Completed
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {addRoom === true && (
        <div className="add-room-form">
          <div className="add-room-cont">
            <p className="add-room-title">Add New House</p>
            <div className="add-room-info">
              <div className="input-group">
                <input
                  required
                  id="urlImage"
                  name="urlImage"
                  className={`input-input`}
                  type="text"
                  placeholder=""
                  value={roomData.urlImage}
                  onChange={handleInputChangeAdd}
                  autoComplete="on"
                ></input>
                <label htmlFor="urlImage" className={`input-label`}>
                  Image
                </label>
              </div>
              <div className="input-group">
                <input
                  required
                  id="date"
                  name="date"
                  className={`input-input`}
                  type="date"
                  placeholder=""
                  value={roomData.date}
                  onChange={handleInputChangeAdd}
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
                  value={roomData.place}
                  onChange={handleInputChangeAdd}
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
                  value={roomData.price}
                  onChange={handleInputChangeAdd}
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
                  value={roomData.describe}
                  onChange={handleInputChangeAdd}
                  autoComplete="on"
                ></input>
                <label htmlFor="describe" className={`input-label`}>
                  Describe
                </label>
              </div>
              <div className="input-group">
                <input
                  required
                  id="name"
                  name="name"
                  className={`input-input`}
                  type="text"
                  placeholder=""
                  value={roomInfoChildren.name}
                  onChange={handleInputChangeChild}
                  autoComplete="on"
                ></input>
                <label htmlFor="name" className={`input-label`}>
                  Room name
                </label>
              </div>
              <div className="input-group">
                <input
                  required
                  id="des"
                  name="des"
                  className={`input-input`}
                  type="text"
                  placeholder=""
                  value={roomInfoChildren.des}
                  onChange={handleInputChangeChild}
                  autoComplete="on"
                ></input>
                <label htmlFor="des" className={`input-label`}>
                  Detail Description
                </label>
              </div>
              <div className="input-group">
                <input
                  required
                  id="address"
                  name="address"
                  className={`input-input`}
                  type="text"
                  placeholder=""
                  value={roomInfoChildren.address}
                  onChange={handleInputChangeChild}
                  autoComplete="on"
                ></input>
                <label htmlFor="address" className={`input-label`}>
                  Address
                </label>
              </div>
              <div className="add-room-submit-home">
                <button
                  className="add-room-btn"
                  type="submit"
                  onClick={() => {
                    setAddRoom(!addRoom);
                  }}
                >
                  Cancel
                </button>
                <button className="add-room-btn add-room-home-submit" type="submit" onClick={handleSubmitAdd}>
                  Add Room
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {isDisablePopup === true && (
        <ConfirmationPopup
          message={msgConfirmDisable}
          onConfirm={() => {
            handleDisableRoom(false);
          }}
          onCancel={() => {
            setIsDisablePopup(false);
          }}
        />
      )}
    </div>
  );
}

export default MyRooms;
