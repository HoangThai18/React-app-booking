import './index.css';
import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { getRenterByUserName } from '../../db/rentersDTO';
import { getRoomRented } from '../../db/roomsDTO';
import { getRenterBill } from '../../db/billsDTO';
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
function RentedRoom() {
  const user = useSelector((state) => state.userReducer.currentUser);
  const [currentRenter, setCurrentRenter] = useState(null);
  const [roomRenter, setRoomRenter] = useState(null);
  const [renterBill, setRenterBill] = useState(null);
  console.log(renterBill);

  async function fetchRenterRented(username) {
    try {
      const renter = await getRenterByUserName(username);
      setCurrentRenter(renter);
    } catch (error) {
      console.error('Error fetching renter:', error);
    }
  }

  async function fetchRoomRented(roomID, motelID) {
    try {
      const room = await getRoomRented(roomID, motelID);
      setRoomRenter(room);
    } catch (error) {
      console.error('Error fetching room:', error);
    }
  }

  async function fetchRentedBill(motelID, userName) {
    try {
      const bills = await getRenterBill(motelID, userName);
      setRenterBill(bills);
    } catch (error) {
      console.error('Error fetching bill:', error);
    }
  }

  useEffect(() => {
    if (user?.username) {
      fetchRenterRented(user.username);
    }
  }, [user]);

  useEffect(() => {
    if (currentRenter?.roomID) {
      fetchRoomRented(currentRenter.roomID, currentRenter.motelRoomID);
    }
  }, [currentRenter]);

  useEffect(() => {
    if (roomRenter?.renter?.motelRoomID && roomRenter?.renter?.userName) {
      fetchRentedBill(roomRenter.renter.motelRoomID, roomRenter.renter.userName);
    }
  }, [roomRenter]);

  const getMatchingImageSrc = () => {
    if (!roomRenter || !roomRenter.imgs || !currentRenter) {
      return '';
    }

    const matchingRoom = roomRenter.data.roomsList.find((room) => room.motelRoomID === roomRenter.imgs.motelRoomID);
    if (matchingRoom && matchingRoom.motelRoomID === roomRenter.imgs.motelRoomID) {
      return roomRenter.imgs.src || '';
    }

    return '';
  };

  return (
    <div className="rented-room-layout">
      <div className="rented-room-top">
        <div className="rented-room-img">
          <img className="rented-room-img-tag" src={getMatchingImageSrc()} alt="Room" />
        </div>
        <div className="rented-room-info-top">
          <div className="rented-room-info">
            <p className="room-info-name">{roomRenter?.data.roomInfo.name}</p>
            <div className="room-info-item">
              <p className="room-info-item-p">Address: {roomRenter?.data.roomInfo.address}</p>
              <p className="room-info-item-p">Description: {roomRenter?.data.roomInfo.des}</p>
            </div>
          </div>
          <div className="rented-room-stakeholder">
            <div className="rented-stakeholder-info">
              <img className="rented-host-avatar" src={roomRenter?.host.urlImg} alt="Host" />
              <div className="stakeholder-info">
                <p className="stakeholder-name">Host: {roomRenter?.host.fullName}</p>
                <p>Email: {roomRenter?.host.email}</p>
                <p>Phone: {roomRenter?.host.phone}</p>
              </div>
            </div>
            <div className="rented-stakeholder-info">
              <img className="rented-host-avatar" src={roomRenter?.renter.avatar} alt="Renter" />
              <div className="stakeholder-info">
                <p className="stakeholder-name">Renter: {roomRenter?.renter.fullName}</p>
                <p>Email: {roomRenter?.renter.email}</p>
                <p>Phone: {roomRenter?.renter.phone}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="rented-room-bill">
        <div className="rented-bill-cont">
          <div className="rented-bill-items">
            <div className="rented-bill-list">
              <ul className="rented-bill-info rented-bill-info-title">
                <li className="rented-bill-mont">Month</li>
                <li className="rented-bill-room-name">Room Name</li>
                <li className="rented-bill-e">Electricity</li>
                <li className="rented-bill-w">Water</li>
                <li className="rented-bill-s">Security</li>
                <li className="rented-bill-g">Garbage</li>
                <li className="rented-bill-total">Total</li>
              </ul>
              <div className="rented-bill-scroll">
                {renterBill?.map((bill, index) => (
                  <ul key={index} className="rented-bill-info rented-bill-info-item">
                    <li className="rented-bill-mont">{monthNames[bill.month]}</li>
                    <li className="rented-bill-room-name">{bill.roomName}</li>
                    <li className="rented-bill-e">{bill.roomService.elecPrice}$</li>
                    <li className="rented-bill-w">{bill.roomService.water}$</li>
                    <li className="rented-bill-s">{bill.roomService.security}$</li>
                    <li className="rented-bill-g">{bill.roomService.garbage}$</li>
                    <li className="rented-bill-total">{bill.billTotal}$</li>
                  </ul>
                ))}
              </div>
            </div>
            <div className="rented-bill-bank">
              <p className="rented-bill-bank-title">Billing Information</p>
              <div className="rented-bill-bank-info">
                <p className="rented-bank-info-p">Account name: {roomRenter?.host.bank.name}</p>
                <p className="rented-bank-info-p">Bank name: {roomRenter?.host.bank.bankName}</p>
                <p className="rented-bank-info-p">Bank account: {roomRenter?.host.bank.bankAcc}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RentedRoom;
