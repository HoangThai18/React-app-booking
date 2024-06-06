import './index.css';
import { useState, useEffect } from 'react';
import { addNewBill, getRoomBillsData } from '../../db/billsDTO';
import { IoClose } from 'react-icons/io5';
import { IoMdArrowRoundBack } from 'react-icons/io';
import { IoAddCircleOutline } from 'react-icons/io5';
const sixMont = '6 Month';
const twelveMont = '12 Month';
const monthNames = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];
function RoomBill(prop) {
  const roomData = prop.selectedMyRoom;

  const [roomBills, setRoomBills] = useState([]);
  const [billStatusPopUp, setBillStatusPopUp] = useState(0);
  const [selectedOption, setSelectedOption] = useState(0);
  const [selectedRoomBills, setSelectedRoomBills] = useState(0);
  const [elecPrice, setElecPrice] = useState(0);
  const [totalNumber, setTotalNumber] = useState(0);
  const [billMoth, setBillMoth] = useState(0);
  const [billDetail, setbillDetail] = useState({});

  const handleSelectChange = (event) => {
    setSelectedOption(event.target.value);
  };

  async function fetchRoomBills(motelRoomID) {
    try {
      const bills = await getRoomBillsData(motelRoomID);
      setRoomBills(bills);
    } catch (error) {}
  }
  function parseTimestamp(timestamp) {
    const date = new Date(timestamp);

    const monthIndex = date.getMonth();
    const year = date.getFullYear();

    const monthName = monthNames[monthIndex];
    return { monthName, year, timestamp };
  }

  function total() {
    const roomPrice = roomData.data.roomsList[selectedOption]?.price;
    const elecTotal = elecPrice * roomData.data.roomInfo.electricity;
    const water = roomData.data.roomInfo.water;
    const security = roomData.data.roomInfo.security;
    const garbage = roomData.data.roomInfo.garbage;
    const totalSum = roomPrice + elecTotal + water + security + garbage;
    setTotalNumber(totalSum);
  }

  useEffect(() => {
    total();
  }, [elecPrice]);

  useEffect(() => {
    fetchRoomBills(roomData?.data?.roomsList[selectedRoomBills]?.motelRoomID);
  }, [selectedRoomBills]);

  async function addRoomBill() {
    const renter = roomData.renters.find(
      (renter) => renter.motelRoomID === roomData?.data?.roomsList[selectedOption]?.motelRoomID
    );
    if (elecPrice <= 0) {
      alert('Please enter electricity price!');
      return;
    } else if (
      !renter?.avatar ||
      !renter.email ||
      !renter.fullName ||
      !renter.phone ||
      !renter.time ||
      !renter.userName
    ) {
      alert('There are no renter yet!');
      return;
    } else {
      const billData = {
        roomID: roomData.data.id,
        motelRoomID: roomData.data.roomsList[selectedOption]?.motelRoomID,
        created: Date.now(),
        modified: Date.now(),
        month: billMoth,
        renter: {
          avatar: renter?.avatar,
          email: renter.email,
          fullName: renter.fullName,
          phone: renter.phone,
          time: renter.time,
          userName: renter.userName,
        },
        host: {
          bank: roomData.host.bank,
          fullName: roomData.host.fullName,
          email: roomData.host.email,
          phone: roomData.host.phone,
        },
        roomService: {
          price: roomData.data.roomsList[selectedOption]?.price,
          elecPrice: elecPrice * roomData.data.roomInfo.electricity,
          water: roomData.data.roomInfo.water,
          security: roomData.data.roomInfo.security,
          garbage: roomData.data.roomInfo.garbage,
        },
        status: 1,
        roomName: roomData.data.roomsList[selectedOption].roomName,
        houseName: roomData.data.roomInfo.name,
        billTotal:
          roomData.data.roomsList[selectedOption]?.price +
          elecPrice * roomData.data.roomInfo.electricity +
          roomData.data.roomInfo.water +
          roomData.data.roomInfo.security +
          roomData.data.roomInfo.garbage,
      };
      await addNewBill(billData);
      alert('Success!');
      const bills = await getRoomBillsData(roomData?.data?.roomsList[selectedRoomBills]?.motelRoomID);
      setRoomBills(bills);
      setBillStatusPopUp(1);
    }
  }

  return (
    <div className="room-bill-layout">
      <div className="room-bill-cont">
        {billStatusPopUp === 0 && (
          <div className="room-bill-content">
            <div
              className="room-bill-close"
              onClick={() => {
                prop.setIsRoomBill(false);
              }}
            >
              <IoClose className="room-bill-navigate-icon"></IoClose>
            </div>
            <div className="room-bill-op">
              <p
                className="room-bill-title"
                onClick={() => {
                  setBillStatusPopUp(false);
                }}
              >
                {roomData.data.roomInfo.name}'s Bills
              </p>
            </div>
            <div className="bill-house-sec">
              <IoAddCircleOutline
                className="add-bill-icon"
                onClick={() => {
                  setBillStatusPopUp(2);
                }}
              ></IoAddCircleOutline>
              <select
                id="single-select"
                className="bill-house-select"
                value={selectedRoomBills}
                onChange={(e) => {
                  setSelectedRoomBills(e.target.value);
                }}
              >
                {roomData.data.roomsList.map((room, index) => (
                  <option key={index} value={index}>
                    {room?.roomName}
                  </option>
                ))}
              </select>
            </div>
            <ul className="room-bill-items">
              {roomBills.map((bill, index) => {
                const { year } = parseTimestamp(bill.created);
                return (
                  <li
                    key={index}
                    className="room-bill-item"
                    onClick={() => {
                      setbillDetail(roomBills[index]);
                      setBillStatusPopUp(1);
                    }}
                  >
                    <img
                      className="room-bill-item-img"
                      src={
                        roomData.imgs.find(
                          (img) => img.data?.motelRoomID === roomData?.data?.roomsList[selectedRoomBills]?.motelRoomID
                        )?.data?.src || 'https://i.pinimg.com/236x/8e/f5/a5/8ef5a5ec59471fa971d00941ff694264.jpg'
                      }
                      alt=""
                    ></img>
                    <p className="room-bill-item-time">
                      {monthNames[bill.month]} {year}
                    </p>
                    <p className="room-bill-item-total">{bill.billTotal}$</p>
                  </li>
                );
              })}
            </ul>
          </div>
        )}

        {billStatusPopUp === 1 && (
          <div className="room-bill-content">
            <>
              <p className="room-bill-title">Bill detail</p>
              <div className="room-bill-content">
                <div className="room-bill-navigate">
                  <IoMdArrowRoundBack
                    className="room-bill-navigate-icon"
                    onClick={() => {
                      setBillStatusPopUp(0);
                    }}
                  ></IoMdArrowRoundBack>
                  <IoClose
                    className="room-bill-navigate-icon"
                    onClick={() => {
                      prop.setIsRoomBill(false);
                    }}
                  ></IoClose>
                </div>
                <div className="room-bill-info">
                  <ul className="room-bill-top">
                    <li className="bill-info">{billDetail.houseName}</li>
                    <li>Host: {billDetail.host.fullName}</li>
                    <li>Email: {billDetail.host?.email}</li>
                    <li>Bank name: {billDetail?.host?.bank?.bankName}</li>
                    <li>Bank account: {billDetail?.host?.bank?.bankAcc}</li>
                  </ul>
                  <ul className="room-bill-top">
                    <li className="bill-info">
                      <p>{billDetail.roomName}</p>
                    </li>
                    <li>Renter name: {billDetail.renter.fullName}</li>
                    <li>Email: {billDetail.renter.email}</li>
                    <li>Phone: {billDetail.renter.phone}</li>
                    <li>Rental period: {billDetail.renter.time === 0 ? sixMont : twelveMont}</li>
                  </ul>
                </div>
                <p className="room-bill-date">
                  Rent for {monthNames[billDetail.month]} {new Date(billDetail.created).getFullYear()}
                </p>
                <div className="room-bill-rent">
                  <div className="room-bill-rent-item">
                    <div className="rent-item-content">
                      <p className="room-bill-rent-item-title">Room rent: </p>
                      <p>{billDetail.roomService.price}/Month</p>
                    </div>
                    <div className="rent-item-content">
                      <p className="room-bill-rent-item-title">Electricity: </p>
                      <p>{billDetail.roomService.elecPrice}$</p>
                    </div>
                    <div className="rent-item-content">
                      <p className="room-bill-rent-item-title">Water: </p>
                      <p>{billDetail.roomService.water}$/Month</p>
                    </div>
                    <div className="rent-item-content">
                      <p className="room-bill-rent-item-title">Security: </p>
                      <p>{billDetail.roomService.security}$/Month</p>
                    </div>
                    <div className="rent-item-content">
                      <p className="room-bill-rent-item-title">Garbage: </p>
                      <p>{billDetail.roomService.garbage}$/Month</p>
                    </div>
                  </div>
                  <div className="room-bill-rent-item">
                    <div className="room-bill-price-price">
                      <p className="room-bill-price-title">Total</p>
                      <p>{billDetail.billTotal}$</p>
                    </div>
                  </div>
                </div>
              </div>
            </>
          </div>
        )}
        {billStatusPopUp === 2 && (
          <>
            <p className="room-bill-title">Create Room Bill</p>
            <div className="room-bill-content">
              <div className="room-bill-navigate">
                <IoMdArrowRoundBack
                  className="room-bill-navigate-icon"
                  onClick={() => {
                    setBillStatusPopUp(0);
                  }}
                ></IoMdArrowRoundBack>
                <IoClose
                  className="room-bill-navigate-icon"
                  onClick={() => {
                    prop.setIsRoomBill(false);
                  }}
                ></IoClose>
              </div>
              <div className="room-bill-info">
                <ul className="room-bill-top">
                  <li className="bill-info">
                    <p>{roomData?.data?.roomInfo?.name}</p>
                    <select
                      id="single-select"
                      className="bill-house-select"
                      value={selectedOption}
                      onChange={handleSelectChange}
                    >
                      {roomData.data.roomsList.map((room, index) => (
                        <option key={index} value={index}>
                          {room?.roomName}
                        </option>
                      ))}
                    </select>
                  </li>
                  <li>Host: {roomData?.host?.fullName}</li>
                  <li>Bank name: {roomData?.host?.bank?.bankName}</li>
                  <li>Bank account: {roomData?.host?.bank?.bankAcc}</li>
                </ul>
                <ul className="room-bill-top">
                  <li className="bill-info">
                    <p>{roomData.data.roomsList[selectedOption]?.roomName}</p>
                  </li>
                  <li>Renter name: {roomData.renters[selectedOption]?.fullName}</li>
                  <li>Email: {roomData.renters[selectedOption]?.email}</li>
                  <li>Phone: {roomData.renters[selectedOption]?.phone}</li>
                </ul>
              </div>
              <p className="room-bill-date">
                Rent for{' '}
                <input
                  className="create-bill-input"
                  type="number"
                  min="0"
                  maxLength="12"
                  onKeyPress={(e) => {
                    if (e.key === '-' || e.key === 'e' || e.key === '.' || e.target.value.length >= 2) {
                      e.preventDefault();
                    }
                  }}
                  value={billMoth}
                  onChange={(e) => {
                    const value = Math.max(0, e.target.value);
                    setBillMoth(value);
                  }}
                ></input>{' '}
              </p>
              <div className="room-bill-rent">
                <div className="room-bill-rent-item">
                  <div className="rent-item-content">
                    <p className="room-bill-rent-item-title">Room rent: </p>
                    <p>{roomData.data.roomsList[selectedOption]?.price}/Month</p>
                  </div>
                  <div className="rent-item-content">
                    <p className="room-bill-rent-item-title">Electricity: </p>
                    <p>{roomData.data.roomInfo.electricity}$</p>
                    <IoClose></IoClose>
                    <input
                      className="create-bill-input"
                      type="number"
                      min="0"
                      maxLength="10"
                      onKeyPress={(e) => {
                        if (e.key === '-' || e.key === 'e' || e.key === '.' || e.target.value.length >= 10) {
                          e.preventDefault();
                        }
                      }}
                      value={elecPrice}
                      onChange={(e) => {
                        const value = Math.max(0, e.target.value);
                        setElecPrice(value);
                      }}
                    ></input>
                    Kw
                  </div>

                  <div className="rent-item-content">
                    <p className="room-bill-rent-item-title">Water: </p>
                    <p>{roomData.data.roomInfo.water}$/Month</p>
                  </div>
                  <div className="rent-item-content">
                    <p className="room-bill-rent-item-title">Security: </p>
                    <p>{roomData.data.roomInfo.security}$</p>
                  </div>
                  <div className="rent-item-content">
                    <p className="room-bill-rent-item-title">Garbage: </p>
                    <p>{roomData.data.roomInfo.garbage}$/Month</p>
                  </div>
                </div>
                <div className="room-bill-rent-item">
                  <div className="room-bill-price-price">
                    <p className="room-bill-price-title">Total</p>
                    <p>{totalNumber}$/Month</p>
                  </div>
                </div>

                <div class="create-bill-submit">
                  <button
                    class="create-bill-btn"
                    onClick={() => {
                      addRoomBill();
                    }}
                  >
                    Create Room Bill
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default RoomBill;
