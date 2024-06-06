import './index.css';
import { useState, useEffect } from 'react';
import { getRentersData, setRenter, cleanRenters, removeRenter } from '../../db/rentersDTO';
import { disableMotelRoom } from '../../db/roomsDTO';
import { IoClose } from 'react-icons/io5';
import ConfirmationPopup from '../../components/confirmPopup';
const renderConfirmMsg = 'Set this user as a renter ?';
const removeRenderConfirmMsg = 'Remove this renter ?';

function Renters({ selectedMyRoom, setIsRenters }) {
  const [renters, setRenters] = useState([]);
  const [renterData, setRenterData] = useState([]);
  const [renterPopup, setRenterPopup] = useState(false);
  const [removeRenterPopup, setRemoveRenterPopup] = useState(false);
  const [selectedMotel, setSelectedMotel] = useState(-1);

  async function fetchRenters(roomID) {
    try {
      const renters = await getRentersData(roomID);
      setRenters(renters);
    } catch (error) {}
  }
  useEffect(() => {
    fetchRenters(selectedMyRoom.data.id);
  }, [selectedMyRoom.data.id]);

  async function setRenterRole() {
    await cleanRenters(renterData.motelRoomID);
    setRenter(renterData.motelRoomID, renterData?.userName);
    const renters = await getRentersData(selectedMyRoom.data.id);
    setRenters(renters);
    await disableMotelRoom(selectedMyRoom.data.id, selectedMyRoom.data.roomsList[selectedMotel].motelRoomID, false);
  }
  async function removeRenterRole() {
    await removeRenter(renterData.motelRoomID, renterData?.userName);
    const renters = await getRentersData(selectedMyRoom.data.id);
    setRenters(renters);
  }
  const handleSelectChange = (event) => {
    setSelectedMotel(parseInt(event.target.value, 10));
  };

  return (
    <div className="renters-layout">
      <div className="renters-cont">
        <div
          className="renders-close"
          onClick={() => {
            setIsRenters(false);
          }}
        >
          <IoClose className="renders-close-icon"></IoClose>
        </div>
        <p className="renters-title">Room Viewing Request</p>
        <div className="select-motel-renter">
          <select
            id="single-select"
            className="select-motel-renter-tag"
            value={selectedMotel}
            onChange={(e) => {
              handleSelectChange(e);
            }}
          >
            <option
              value={-1}
              onClick={() => {
                setSelectedMotel(-1);
              }}
            >
              All
            </option>
            {selectedMyRoom.data.roomsList.map((room, index) => (
              <option key={index} value={index}>
                {room?.roomName}
              </option>
            ))}
          </select>
        </div>

        <ul className="renters-list-title renters-item">
          <li className="renters-order">Order</li>
          <li className="renters-avatar">Avatar</li>
          <li className="renters-name">FullName</li>
          <li className="renters-email">Email</li>
          <li className="renters-phone">Phone number</li>
          <li className="renters-room">Room Name</li>
          <li className="renters-set-renter">Edit Renter</li>
        </ul>
        <ul className="renters-list-items">
          {(selectedMotel === -1
            ? renters
            : renters?.filter(
                (renter) => renter?.motelRoomID === selectedMyRoom?.data?.roomsList[selectedMotel]?.motelRoomID
              )
          ).map((renter, index) => (
            <li className="renters-item" key={`renter[${index}]`}>
              <div className="renters-order">{index + 1}</div>
              <div className="renters-avatar">
                <img className="renters-avatar-img" src={renter.avatar} alt=""></img>
              </div>
              <div className="renters-name">{renter.fullName}</div>
              <div className="renters-email">{renter.email}</div>
              <div className="renters-phone">{renter.phone}</div>
              <div className="renters-room">{renter.roomName}</div>
              <div className="renters-set-renter">
                <button
                  className="set-renter-btn render-btn-add"
                  onClick={() => {
                    setRenterData(renters[index]);
                    setRenterPopup(true);
                  }}
                >
                  Renter
                </button>
                <button
                  className="set-renter-btn render-btn-remove"
                  onClick={() => {
                    setRenterData(renters[index]);
                    setRemoveRenterPopup(true);
                  }}
                >
                  Remove
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
      {renterPopup === true && (
        <ConfirmationPopup
          message={renderConfirmMsg}
          onCancel={() => {
            setRenterPopup(false);
          }}
          onConfirm={() => {
            setRenterRole();
          }}
        ></ConfirmationPopup>
      )}
      {removeRenterPopup === true && (
        <ConfirmationPopup
          message={removeRenderConfirmMsg}
          onCancel={() => {
            setRemoveRenterPopup(false);
          }}
          onConfirm={() => {
            removeRenterRole();
          }}
        ></ConfirmationPopup>
      )}
    </div>
  );
}

export default Renters;
