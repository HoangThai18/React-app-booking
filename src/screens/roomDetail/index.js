import './index.css';
import NavBar from '../../components/navBar';
import { addMotelData, getRoomByID, updateBookingDes } from '../../db/roomsDTO';
import { addRenter } from '../../db/rentersDTO';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Carousel } from 'react-responsive-carousel';
import { FaCheck } from 'react-icons/fa6';
import { IoIosArrowBack } from 'react-icons/io';
import { useSelector, useDispatch } from 'react-redux';
import { IoAddCircleOutline } from 'react-icons/io5';
import { RiEdit2Line } from 'react-icons/ri';
import { GiSightDisabled } from 'react-icons/gi';
import ConfirmationPopup from '../../components/confirmPopup';
import { IoEyeSharp } from 'react-icons/io5';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import { disableMotelRoom } from '../../db/roomsDTO';
import { setLoading } from '../../actions/config';
import { updateMotelRoomData } from '../../db/roomsDTO';

const disableConfirmMsg = 'Do you want disable this motel room?';
const enableConfirmMsg = 'Do you want enable this motel room?';
const selectedRoomDtail = 'available-nav-items-selected';
const sixMont = '6 Month';
const twelveMont = '12 Month';
const duration = 'select-duration-selected';
const disableColor = 'disable-color';
const disNameMotelRoom = 'disable-motel-room';
const userRole = {
  MOD: 3,
  ADMIN: 2,
  NORMAL_USER: 1,
};

function RoomDetail() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const selectedRoom = useSelector((state) => state.selectedRoomReducer?.selecRoom);
  const user = useSelector((state) => state.userReducer).currentUser;
  const [roomArea, setRoomArea] = useState('');
  const [bookingPage, setBookingPage] = useState(false);
  const [selecMotelRoom, setSelecMotelRoom] = useState(0);
  const [roomImg, setRoomImg] = useState('');
  const [roomAcreage, setRoomAcreage] = useState('');
  const [roomName, setRoomName] = useState('');
  const [roomPrice, setRoomPrice] = useState('');
  const [serviceOne, setServiceOne] = useState('');
  const [serviceTwo, setServiceTwo] = useState('');
  const [serviceThree, setServiceThree] = useState('');
  const [serviceFour, setServiceFour] = useState('');
  const [serviceFive, setServiceFive] = useState('');
  const [rentalTime, setRentalTime] = useState(0);
  const [bookingDes, setBookingDes] = useState({});
  const [isAddMotel, setIsAddMotel] = useState(false);
  const [isBookingDes, setIsBookingDes] = useState(false);
  const [contactData, setContactData] = useState({});
  const [disMotelRoom, setDisMotelRoom] = useState(false);
  const [motelRoomId, setMotelRoomId] = useState();
  const [status, setStatus] = useState();
  const [editingRoomIndex, setEditingRoomIndex] = useState(false);
  const [motelRoomUpdate, setMotelRoomUpdate] = useState({});
  const [imgMotelRoomSelect, setImgMotelRoomSelect] = useState({});
  function goToUserHome() {
    navigate('/userHome');
  }

  function generateRandomId(length = 20) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    const charactersLength = characters.length;

    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }

    return result;
  }
  const handleOpenPopup = (motelRoomID, currentStatus) => {
    setMotelRoomId(motelRoomID);
    setStatus(currentStatus);
  };
  async function addMotel() {
    if (roomImg || !roomName || !roomAcreage || !roomPrice) {
      alert('Please fill in all required fields.');
      return;
    }

    const motelRoomID = generateRandomId();
    const data = {
      motelImg: {
        src: roomImg,
        motelRoomID: motelRoomID,
        roomID: roomArea.data.id,
        created: Date.now(),
        modified: Date.now(),
      },
      motelData: {
        acreage: roomAcreage,
        facilities: [serviceOne, serviceTwo, serviceThree, serviceFour, serviceFive],
        motelRoomID: motelRoomID,
        price: roomPrice,
        roomName: roomName,
        status: 1,
      },
    };
    const success = await addMotelData(selectedRoom.data.id, data);
    if (success) {
      fetchRoomById(selectedRoom.data.id);
      alert('Add Success!');
      setRoomImg('');
      setRoomAcreage('');
      setRoomName('');
      setRoomPrice('');
      setServiceOne('');
      setServiceTwo('');
      setServiceThree('');
      setServiceFour('');
      setServiceFive('');
      setIsAddMotel(false);
    }
  }

  async function fetchRoomById(id) {
    try {
      const room = await getRoomByID(id);
      setRoomArea(room);
    } catch (error) {}
  }
  async function handleDisableMotelRoom(motelRoomID, status) {
    try {
      const roomId = selectedRoom?.data?.id;
      await disableMotelRoom(roomId, motelRoomID, status);
      dispatch(setLoading(true));
      const room = await getRoomByID(roomId);
      setRoomArea(room);
      dispatch(setLoading(false));
    } catch (e) {}
  }
  useEffect(() => {
    if (selectedRoom?.data?.id) {
      fetchRoomById(selectedRoom.data.id);
    }
  }, [selectedRoom?.data?.id]);
  function handleInputChangeUpdate(e) {
    const { name, value } = e.target;
    if (name.startsWith('service')) {
      const index = parseInt(name.replace('service', '')) - 1;
      const newFacilities = [...motelRoomUpdate.facilities];
      newFacilities[index] = value;
      setMotelRoomUpdate({
        ...motelRoomUpdate,
        facilities: newFacilities,
      });
    } else {
      setMotelRoomUpdate({
        ...motelRoomUpdate,
        [name]: value,
      });
    }
  }

  function handleInputChangeUpdateImg(e) {
    const { name, value } = e.target;
    setImgMotelRoomSelect({
      ...imgMotelRoomSelect,
      data: {
        ...imgMotelRoomSelect.data,
        [name]: value,
      },
    });
  }
  function handleBookingDesChange(e) {
    const { name, value } = e.target;
    setBookingDes({
      ...bookingDes,
      [name]: value,
    });
  }
  async function handleSubmitAddMotel() {
    try {
      if (
        !imgMotelRoomSelect.data.src ||
        !motelRoomUpdate.facilities ||
        !motelRoomUpdate.acreage ||
        !motelRoomUpdate.roomName ||
        !motelRoomUpdate.price
      ) {
        alert('Please fill in all required fields.');
        return;
      }
      const data = {
        motelImg: {
          src: imgMotelRoomSelect?.data?.src || '',
          motelRoomID: motelRoomUpdate.motelRoomID,
          roomID: roomArea.data.id,
          created: Date.now(),
          modified: Date.now(),
        },
        motelData: {
          acreage: motelRoomUpdate.acreage,
          facilities: [
            motelRoomUpdate.facilities[0],
            motelRoomUpdate.facilities[1],
            motelRoomUpdate.facilities[2],
            motelRoomUpdate.facilities[3],
            motelRoomUpdate.facilities[4],
          ],
          motelRoomID: motelRoomUpdate.motelRoomID,
          price: motelRoomUpdate.price,
          roomName: motelRoomUpdate.roomName,
          status: 1,
        },
      };

      const success = await updateMotelRoomData(data);
      if (success) {
        fetchRoomById(selectedRoom.data.id);
        alert('Edit success');
        setEditingRoomIndex(false);
      } else {
        alert('Edit field');
      }
    } catch (ex) {
      return false;
    }
  }
  async function handleSubmit() {
    try {
      if (
        !bookingDes.name ||
        !bookingDes.address ||
        !bookingDes.des ||
        !bookingDes.electricity ||
        !bookingDes.water ||
        !bookingDes.security ||
        !bookingDes.garbage
      ) {
        alert('Please fill in all required fields.');
        return;
      }
      await updateBookingDes(selectedRoom?.data.id, bookingDes);
      const room = await getRoomByID(selectedRoom?.data.id);
      setRoomArea(room);
      alert('Update Success!');
      setIsBookingDes(false);
    } catch (ex) {
      return false;
    }
  }
  function handleContactChange(e) {
    const { name, value } = e.target;
    setContactData({
      ...contactData,
      [name]: value,
    });
  }
  async function handleContactSubmit() {
    try {
      if (!contactData.fullName || !contactData.phone || !contactData.email) {
        alert('Please fill in all required fields.');
        return;
      }
      const checkAddRenter = await addRenter(roomArea?.data?.roomsList[selecMotelRoom]?.motelRoomID, contactData);
      if (!checkAddRenter) {
        alert(`You have contacted us to view this room!`);
      } else {
        alert(`Contact successful!`);
      }
    } catch (ex) {
      console.error('Error during contact submit: ', ex);
      alert('An unexpected error occurred. Please try again.');
    }
  }
  useEffect(() => {
    const selectedImg = roomArea?.imgs
      ?.filter((img) => img.data?.motelRoomID)
      ?.find((img) => img.data?.motelRoomID === roomArea?.data?.roomsList[selecMotelRoom]?.motelRoomID);
    setImgMotelRoomSelect(selectedImg || {});
  }, [roomArea, selecMotelRoom]);
  return (
    <>
      <NavBar></NavBar>
      <div className="room-detail-cont">
        {bookingPage === false && (
          <>
            <div className="detail-overview">
              <button
                className="back-to-rooms"
                onClick={() => {
                  goToUserHome();
                }}
              >
                <IoIosArrowBack className="back-to-rooms-icon"></IoIosArrowBack>
              </button>
              <Carousel className="detail-carousel">
                {roomArea?.imgs &&
                  roomArea?.imgs?.map((img, index) => (
                    <div className="detail-img" key={`roomImg${index}`}>
                      <img className="detail-img-tags" src={img.data?.src} alt=""></img>
                    </div>
                  ))}
              </Carousel>
              <div className="detail-booking">
                <div className="detail-booking-des">
                  {user?.role === userRole.MOD && (
                    <div
                      className="detail-booking-add"
                      onClick={() => {
                        setBookingDes(roomArea?.data.roomInfo);
                        setIsBookingDes(true);
                      }}
                    >
                      <RiEdit2Line className="detail-booking-add-btn"></RiEdit2Line>
                    </div>
                  )}

                  <p className="detail-booking-name">
                    {roomArea?.data?.roomInfo.name === '' ? 'Name' : roomArea?.data?.roomInfo.name}
                  </p>
                  <p>{roomArea?.data?.roomInfo.address === '' ? 'Address:' : roomArea?.data?.roomInfo.address}</p>
                  <p>{roomArea?.data?.roomInfo.des === '' ? 'Description:' : roomArea?.data?.roomInfo.des}</p>
                </div>
                <div className="detail-booking-submit">
                  <ul className="detail-booking-service">
                    <li>Electricity: {roomArea?.data?.roomInfo.electricity}$/Kw</li>
                    <li>Water: {roomArea?.data?.roomInfo.water}$/Month</li>
                    <li>Security: {roomArea?.data?.roomInfo.security}$/Month</li>
                    <li>Garbage: {roomArea?.data?.roomInfo.garbage}$/Month</li>
                  </ul>
                  <div className="detail-booking-price">
                    <p>
                      <span>{roomArea?.data?.price}$</span>/Month
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="detail-available">
              <div className="detail-available-top">
                <p className="available-title">Room available</p>
                <ul className="available-nav">
                  {user?.role === userRole.MOD && (
                    <>
                      <div className="available-nav-add">
                        <IoAddCircleOutline
                          className="available-nav-add-icon"
                          onClick={() => {
                            setIsAddMotel(true);
                          }}
                        ></IoAddCircleOutline>
                      </div>
                    </>
                  )}
                  {roomArea?.data?.roomsList?.map((room, index) => (
                    <div key={`room${index}detail`}>
                      <li
                        className={`${roomArea.data.roomsList[index].status === 0 ? disNameMotelRoom : ''} ${
                          selecMotelRoom === index ? selectedRoomDtail : ''
                        } available-nav-items`}
                        onClick={() => {
                          setSelecMotelRoom(index);
                        }}
                      >
                        <p className={`${roomArea?.data?.roomsList[index]?.status === 0 ? disableColor : ''} `}>
                          {room?.roomName}
                        </p>
                        <>
                          {user?.role === userRole.MOD && (
                            <>
                              <div className="available-nav-add">
                                <>
                                  {room.status === 1 ? (
                                    <GiSightDisabled
                                      className="available-nav-add-icon"
                                      onClick={() => {
                                        setDisMotelRoom(true);
                                        handleOpenPopup(room.motelRoomID, room.status);
                                      }}
                                    />
                                  ) : (
                                    <IoEyeSharp
                                      className="available-nav-add-icon"
                                      onClick={() => {
                                        setDisMotelRoom(true);
                                        handleOpenPopup(room.motelRoomID, room.status);
                                      }}
                                    />
                                  )}
                                </>
                                {selecMotelRoom === index && (
                                  <RiEdit2Line
                                    className="available-nav-add-icon"
                                    onClick={() => {
                                      setEditingRoomIndex(true);
                                      setMotelRoomUpdate(roomArea.data.roomsList[selecMotelRoom]);
                                    }}
                                  ></RiEdit2Line>
                                )}
                              </div>
                            </>
                          )}
                        </>
                      </li>
                    </div>
                  ))}
                </ul>
              </div>
              {user?.role === userRole.MOD && (
                <div
                  className={`${
                    roomArea?.data?.roomsList[selecMotelRoom]?.status === 0 ? disableColor : ''
                  } available-des`}
                >
                  <div className="available-des-info">
                    <p className="available-des-info-top">{roomArea?.data?.roomsList[selecMotelRoom]?.price}$/month</p>
                    <ul className="available-favourite">
                      {roomArea?.data?.roomsList[selecMotelRoom]?.facilities?.map((item, index) => (
                        <li className="available-favourite-items" key={`facilities${index}`}>
                          <FaCheck></FaCheck>
                          <p>{item}</p>
                        </li>
                      ))}
                    </ul>
                    <button
                      className="detail-booking-btn"
                      onClick={() => {
                        setContactData({
                          fullName: user.fullName,
                          phone: user.phone,
                          email: user.email,
                          userName: user?.username,
                          avatar: user.urlImg,
                          time: rentalTime,
                          roomID: roomArea?.data?.id,
                          roomName: roomArea?.data?.roomsList[selecMotelRoom]?.roomName,
                          motelRoomID: roomArea?.data?.roomsList[selecMotelRoom]?.motelRoomID,
                          status: 1,
                          isRenter: 0,
                        });
                        setBookingPage(true);
                      }}
                    >
                      Contact
                    </button>
                  </div>

                  <img
                    className="available-des-img"
                    src={
                      imgMotelRoomSelect?.data?.src ||
                      'https://i.pinimg.com/236x/38/e6/21/38e621e0568b66febbfc9d0c87da134b.jpg'
                    }
                    alt=""
                  />
                </div>
              )}
              {user?.role === userRole.NORMAL_USER && (
                <div className="available-des">
                  <div className="available-des-info">
                    <p className="available-des-info-top">{roomArea?.data?.roomsList[selecMotelRoom]?.price}$/month</p>
                    <ul className="available-favourite">
                      {roomArea?.data?.roomsList[selecMotelRoom]?.facilities?.map((item, index) => (
                        <li className="available-favourite-items" key={`facilities${index}`}>
                          <FaCheck></FaCheck>
                          <p>{item}</p>
                        </li>
                      ))}
                    </ul>
                    <button
                      className="detail-booking-btn"
                      onClick={() => {
                        setContactData({
                          fullName: user.fullName,
                          phone: user.phone,
                          email: user.email,
                          userName: user?.username,
                          avatar: user.urlImg,
                          time: rentalTime,
                          roomID: roomArea?.data?.id,
                          roomName: roomArea?.data?.roomsList[selecMotelRoom]?.roomName,
                          motelRoomID: roomArea?.data?.roomsList[selecMotelRoom]?.motelRoomID,
                          status: 1,
                          isRenter: 0,
                        });
                        setBookingPage(true);
                      }}
                    >
                      Contact
                    </button>
                  </div>

                  <img
                    className="available-des-img"
                    src={
                      roomArea?.imgs
                        ?.filter((img) => img.data?.motelRoomID)
                        ?.find(
                          (img) => img.data?.motelRoomID === roomArea?.data?.roomsList[selecMotelRoom]?.motelRoomID
                        )?.data?.src || 'https://i.pinimg.com/236x/38/e6/21/38e621e0568b66febbfc9d0c87da134b.jpg'
                    }
                    alt=""
                  />
                </div>
              )}
            </div>
          </>
        )}
        {bookingPage === true && (
          <div className="detail-contact">
            <button
              className="back-to-rooms"
              onClick={() => {
                setBookingPage(false);
              }}
            >
              <IoIosArrowBack className="back-to-rooms-icon"></IoIosArrowBack>
            </button>
            <p className="detail-contact-title">Contact</p>
            <div className="detail-contact-cont">
              <form
                className="detail-contact-info"
                onSubmit={(e) => {
                  e.preventDefault();
                }}
              >
                <div className="detail-contact-group">
                  <input
                    required
                    id="fullName"
                    name="fullName"
                    className={`contact-input`}
                    type="text"
                    placeholder=""
                    value={contactData.fullName}
                    onChange={handleContactChange}
                    autoComplete="on"
                  ></input>
                  <label htmlFor="fullName" className={`contact-label`}>
                    Full name
                  </label>
                </div>
                <div className="detail-contact-group">
                  <input
                    required
                    id="phone"
                    name="phone"
                    className={`contact-input`}
                    type="number"
                    placeholder=""
                    value={contactData.phone}
                    onChange={handleContactChange}
                    autoComplete="on"
                  ></input>
                  <label htmlFor="phone" className={`contact-label`}>
                    Phone number
                  </label>
                </div>
                <div className="detail-contact-group">
                  <input
                    required
                    id="email"
                    name="email"
                    className={`contact-input`}
                    type="mail"
                    placeholder=""
                    value={contactData.email}
                    onChange={handleContactChange}
                    autoComplete="on"
                  ></input>
                  <label htmlFor="email" className={`contact-label`}>
                    Email
                  </label>
                </div>
                <div className="detail-contact-group detail-contact-duration">
                  <button
                    className={`select-duration ${rentalTime === 0 ? duration : ''}`}
                    onClick={() => {
                      setRentalTime(0);
                    }}
                  >
                    6 Month
                  </button>
                  <button
                    className={`select-duration ${rentalTime === 1 ? duration : ''}`}
                    onClick={() => {
                      setRentalTime(1);
                    }}
                  >
                    12 Month
                  </button>
                </div>
                <div className="detail-contact-group">
                  <button
                    className="detail-contact-submit"
                    onClick={(e) => {
                      e.preventDefault();
                      handleContactSubmit();
                    }}
                  >
                    Contact to see room
                  </button>
                </div>
              </form>
              <div className="detail-contact-room">
                <div className="detail-contact-room-top">
                  <div className="contact-room-info">
                    <img
                      className="contact-room-info-img"
                      src={
                        roomArea?.imgs?.find(
                          (img) => img.data?.motelRoomID === roomArea?.data?.roomsList[selecMotelRoom]?.motelRoomID
                        )?.data?.src || ''
                      }
                      alt=""
                    ></img>
                    <div>
                      <p className="contact-room-info-name">{roomArea?.data?.roomsList[selecMotelRoom]?.roomName}</p>
                    </div>
                  </div>
                  <div className="booking-detail">
                    <div className="booking-detail-price">{roomArea?.data?.roomsList[selecMotelRoom].price}$/month</div>
                    <div className="booking-detail-items">
                      <p className="booking-detail-item">Rental time: {rentalTime === 0 ? sixMont : twelveMont}</p>
                      <p className="booking-detail-item">
                        Acreage: {roomArea?.data?.roomsList[selecMotelRoom].acreage}
                      </p>
                    </div>
                    <p className="booking-detail-item">{roomArea?.data?.roomInfo.address}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      {isAddMotel === true && (
        <div className="add-motel-layout">
          <div className="add-motel-cont">
            <p className="add-motel-title">Add Room</p>
            <form
              className="add-motel-form"
              onSubmit={(event) => {
                event.preventDefault();
                addMotel();
              }}
            >
              <div className="detail-group room-img-group">
                <input
                  required
                  id="roomImg"
                  name="roomImg"
                  className={`detail-input`}
                  type="text"
                  placeholder=""
                  value={roomImg}
                  onChange={(e) => setRoomImg(e.target.value)}
                  autoComplete="on"
                ></input>
                <label htmlFor="roomImg" className={`detail-label`}>
                  Room Image<span class="required">*</span>
                </label>
              </div>
              <div className="detail-group">
                <input
                  required
                  id="acreage"
                  name="acreage"
                  className={`detail-input`}
                  type="text"
                  placeholder=""
                  value={roomAcreage}
                  onChange={(e) => setRoomAcreage(e.target.value)}
                  autoComplete="on"
                ></input>
                <label htmlFor="acreage" className={`detail-label`}>
                  Acreage<span class="required">*</span>
                </label>
              </div>
              <div className="detail-group">
                <input
                  required
                  id="serviceName"
                  name="serviceName"
                  className={`detail-input`}
                  type="text"
                  placeholder=""
                  value={roomName}
                  onChange={(e) => setRoomName(e.target.value)}
                  autoComplete="on"
                ></input>
                <label htmlFor="serviceName" className={`detail-label`}>
                  Room Name<span class="required">*</span>
                </label>
              </div>
              <div className="detail-group">
                <input
                  required
                  id="servicePrice"
                  name="servicePrice"
                  className={`detail-input`}
                  type="number"
                  placeholder=""
                  value={roomPrice}
                  onChange={(e) => setRoomPrice(e.target.value)}
                  autoComplete="on"
                ></input>
                <label htmlFor="servicePrice" className={`detail-label`}>
                  Room Price<span class="required">*</span>
                </label>
              </div>
              <div className="detail-group">
                <input
                  required
                  id="serviceName"
                  name="serviceOne"
                  className={`detail-input`}
                  type="text"
                  placeholder=""
                  value={serviceOne}
                  onChange={(e) => setServiceOne(e.target.value)}
                  autoComplete="on"
                ></input>
                <label htmlFor="serviceOne" className={`detail-label`}>
                  Service One
                </label>
              </div>
              <div className="detail-group">
                <input
                  required
                  id="serviceTwo"
                  name="serviceTwo"
                  className={`detail-input`}
                  type="text"
                  placeholder=""
                  value={serviceTwo}
                  onChange={(e) => setServiceTwo(e.target.value)}
                  autoComplete="on"
                ></input>
                <label htmlFor="serviceTwo" className={`detail-label`}>
                  Service Two
                </label>
              </div>
              <div className="detail-group">
                <input
                  required
                  id="serviceThree"
                  name="serviceThree"
                  className={`detail-input`}
                  type="text"
                  placeholder=""
                  value={serviceThree}
                  onChange={(e) => setServiceThree(e.target.value)}
                  autoComplete="on"
                ></input>
                <label htmlFor="serviceThree" className={`detail-label`}>
                  Service Three
                </label>
              </div>
              <div className="detail-group">
                <input
                  required
                  id="serviceFour"
                  name="serviceFour"
                  className={`detail-input`}
                  type="text"
                  placeholder=""
                  value={serviceFour}
                  onChange={(e) => setServiceFour(e.target.value)}
                  autoComplete="on"
                ></input>
                <label htmlFor="serviceFour" className={`detail-label`}>
                  Service Four
                </label>
              </div>
              <div className="detail-group">
                <input
                  required
                  id="serviceFive"
                  name="serviceFive"
                  className={`detail-input`}
                  type="text"
                  placeholder=""
                  value={serviceFive}
                  onChange={(e) => setServiceFive(e.target.value)}
                  autoComplete="on"
                ></input>
                <label htmlFor="serviceFive" className={`detail-label`}>
                  Service Five
                </label>
              </div>
              <div className="detail-submit">
                <button
                  className="detail-cancel-btn"
                  onClick={() => {
                    setIsAddMotel(false);
                  }}
                >
                  Cancel
                </button>
                <button
                  className="detail-submit-btn"
                  onClick={(event) => {
                    event.preventDefault();
                    addMotel();
                  }}
                >
                  Add
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {isBookingDes === true && (
        <div className="booking-des-layout">
          <div className="booking-des-cont">
            <p className="booking-des-title">Edit Describe</p>
            <form
              className="booking-des-form"
              onSubmit={(event) => {
                event.preventDefault();
                handleSubmit();
              }}
            >
              <div className="detail-group">
                <input
                  required
                  id="name"
                  name="name"
                  className={`detail-input`}
                  type="text"
                  placeholder=""
                  value={bookingDes.name}
                  onChange={handleBookingDesChange}
                  autoComplete="on"
                ></input>
                <label htmlFor="name" className={`detail-label`}>
                  House Name
                </label>
              </div>
              <div className="detail-group">
                <input
                  required
                  id="des"
                  name="des"
                  className={`detail-input`}
                  type="text"
                  placeholder=""
                  value={bookingDes.des}
                  onChange={handleBookingDesChange}
                  autoComplete="on"
                ></input>
                <label htmlFor="des" className={`detail-label`}>
                  Short Describe
                </label>
              </div>
              <div className="detail-group room-img-group">
                <input
                  required
                  id="address"
                  name="address"
                  className={`detail-input`}
                  type="text"
                  placeholder=""
                  value={bookingDes.address}
                  onChange={handleBookingDesChange}
                  autoComplete="on"
                ></input>
                <label htmlFor="address" className={`detail-label`}>
                  Address
                </label>
              </div>
              <div className="detail-group">
                <input
                  required
                  id="electricity"
                  name="electricity"
                  className={`detail-input`}
                  type="number"
                  placeholder=""
                  value={bookingDes.electricity}
                  onChange={handleBookingDesChange}
                  autoComplete="on"
                ></input>
                <label htmlFor="electricity" className={`detail-label`}>
                  Electricity
                </label>
              </div>
              <div className="detail-group">
                <input
                  required
                  id="water"
                  name="water"
                  className={`detail-input`}
                  type="number"
                  placeholder=""
                  value={bookingDes.water}
                  onChange={handleBookingDesChange}
                  autoComplete="on"
                ></input>
                <label htmlFor="water" className={`detail-label`}>
                  Water
                </label>
              </div>
              <div className="detail-group">
                <input
                  required
                  id="security"
                  name="security"
                  className={`detail-input`}
                  type="number"
                  placeholder=""
                  value={bookingDes.security}
                  onChange={handleBookingDesChange}
                  autoComplete="on"
                ></input>
                <label htmlFor="security" className={`detail-label`}>
                  Security
                </label>
              </div>
              <div className="detail-group">
                <input
                  required
                  id="garbage"
                  name="garbage"
                  className={`detail-input`}
                  type="number"
                  placeholder=""
                  value={bookingDes.garbage}
                  onChange={handleBookingDesChange}
                  autoComplete="on"
                ></input>
                <label htmlFor="garbage" className={`detail-label`}>
                  Garbage
                </label>
              </div>
              <div className="detail-submit">
                <button
                  className="detail-cancel-btn"
                  onClick={() => {
                    setIsBookingDes(false);
                  }}
                >
                  Cancel
                </button>
                <button
                  className="detail-submit-btn"
                  onClick={(event) => {
                    event.preventDefault();
                    handleSubmit();
                  }}
                >
                  Completed
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {disMotelRoom === true && (
        <ConfirmationPopup
          message={status === 1 ? disableConfirmMsg : enableConfirmMsg}
          onCancel={() => setDisMotelRoom(false)}
          onConfirm={async () => {
            if (status === 1) {
              await handleDisableMotelRoom(motelRoomId, false);
            } else {
              await handleDisableMotelRoom(motelRoomId, true);
            }
          }}
        />
      )}{' '}
      {motelRoomUpdate && editingRoomIndex === true && (
        <div className="add-motel-layout">
          <div className="add-motel-cont">
            <p className="add-motel-title">Edit Room</p>
            <form
              className="add-motel-form"
              onSubmit={(event) => {
                event.preventDefault();
                addMotel();
              }}
            >
              <div className="detail-group room-img-group">
                <input
                  required
                  id="src"
                  name="src"
                  className={`detail-input`}
                  type="text"
                  placeholder=""
                  value={imgMotelRoomSelect?.data?.src || ''}
                  onChange={handleInputChangeUpdateImg}
                  autoComplete="on"
                ></input>
                <label htmlFor="src" className={`detail-label`}>
                  Room Image<span class="required">*</span>
                </label>
              </div>
              <div className="detail-group">
                <input
                  required
                  id="acreage"
                  name="acreage"
                  className={`detail-input`}
                  type="text"
                  placeholder=""
                  value={motelRoomUpdate.acreage}
                  onChange={handleInputChangeUpdate}
                  autoComplete="on"
                ></input>
                <label htmlFor="acreage" className={`detail-label`}>
                  Acreage<span class="required">*</span>
                </label>
              </div>
              <div className="detail-group">
                <input
                  required
                  id="roomName"
                  name="roomName"
                  className={`detail-input`}
                  type="text"
                  placeholder=""
                  value={motelRoomUpdate.roomName}
                  onChange={handleInputChangeUpdate}
                  autoComplete="on"
                ></input>
                <label htmlFor="roomName" className={`detail-label`}>
                  Room Name<span class="required">*</span>
                </label>
              </div>
              <div className="detail-group">
                <input
                  required
                  id="price"
                  name="price"
                  className={`detail-input`}
                  type="number"
                  placeholder=""
                  value={motelRoomUpdate.price}
                  onChange={handleInputChangeUpdate}
                  autoComplete="on"
                ></input>
                <label htmlFor="price" className={`detail-label`}>
                  Room Price<span class="required">*</span>
                </label>
              </div>
              {motelRoomUpdate.facilities.map((facility, index) => (
                <div className="detail-group" key={index}>
                  <input
                    required
                    id={`service${index + 1}`}
                    name={`service${index + 1}`}
                    className="detail-input"
                    type="text"
                    placeholder=""
                    value={facility}
                    onChange={handleInputChangeUpdate}
                    autoComplete="on"
                  />
                  <label htmlFor={`service${index + 1}`} className="detail-label">
                    Service {index + 1}
                  </label>
                </div>
              ))}
              <div className="detail-submit">
                <button
                  className="detail-cancel-btn"
                  onClick={() => {
                    setEditingRoomIndex(false);
                  }}
                >
                  Cancel
                </button>
                <button
                  className="detail-submit-btn"
                  onClick={(event) => {
                    event.preventDefault();
                    handleSubmitAddMotel();
                  }}
                >
                  Add
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

export default RoomDetail;
