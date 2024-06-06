import db from './firebase';
import { collection, getDocs, getDoc, query, where, updateDoc, doc, addDoc } from 'firebase/firestore';
import { getImageByRoomAndOrder, addMotelImg, addMainImg } from './imageDTO';
import { getRenterOfRoom } from './rentersDTO';
import { getUserByUsername } from './userDTO';
import { updateUrlMotelRoom } from './imageDTO';

export async function getRoomData() {
  try {
    const userRef = collection(db, 'rooms');
    const q = query(userRef);
    const querySnapshot = await getDocs(q);

    let rooms = [];

    querySnapshot.forEach((doc) => {
      rooms.push(doc.data());
    });
    return rooms;
  } catch (ex) {
    return [];
  }
}

export async function getRoomID() {
  try {
    const userRef = collection(db, 'rooms');
    const q = query(userRef);
    const querySnapshot = await getDocs(q);

    let rooms = [];

    querySnapshot.forEach((doc) => {
      const roomId = doc.id;

      rooms.push(roomId);
    });
    return rooms;
  } catch (ex) {
    console.error('Error fetching rooms:', ex);
    return [];
  }
}

export async function getRoomByID(id) {
  try {
    const roomRef = collection(db, 'rooms');
    const q = query(roomRef, where('id', '==', id));
    const querySnapshot = await getDocs(q);
    if (querySnapshot.empty) {
      return undefined;
    }
    let room = undefined;
    for (const document of querySnapshot.docs) {
      const images = await getImageByRoomAndOrder(id);
      room = { data: document.data(), imgs: images };
    }
    if (querySnapshot.size > 1) {
      console.warn('Multiple documents found with the same ID:', id);
    }
    return room;
  } catch (ex) {
    console.error('Error fetching room:', ex);
    return undefined;
  }
}

export async function updateRoomData(roomID, newData) {
  try {
    const roomsRef = collection(db, 'rooms');
    const q = query(roomsRef, where('id', '==', roomID));
    const querySnapshot = await getDocs(q);
    let roomId = '';
    querySnapshot.forEach((doc) => {
      roomId = doc.id;
    });
    await updateDoc(doc(roomsRef, roomId), {
      date: newData.date,
      describe: newData.describe,
      place: newData.place,
      price: newData.price,
    });
    return true;
  } catch (ex) {
    return false;
  }
}
export async function updateMotelRoomData(newData) {
  try {
    const querySnapshot = await getDocs(collection(db, 'rooms'));
    querySnapshot.forEach(async (doc) => {
      const data = doc.data();
      const roomsList = data.roomsList;
      const updatedRoomsList = await roomsList.map((room) => {
        if (room.motelRoomID === newData.motelData.motelRoomID) {
          return {
            ...room,
            ...newData.motelData,
            motelImg: newData.motelImg,
          };
        }
        return room;
      });
      await updateDoc(doc.ref, { roomsList: updatedRoomsList });
      await updateUrlMotelRoom(newData.motelData.motelRoomID, newData.motelImg);
    });
    return true;
  } catch (ex) {
    return false;
  }
}
export async function updateBookingDes(roomID, newData) {
  try {
    const roomsRef = collection(db, 'rooms');
    const q = query(roomsRef, where('id', '==', roomID));
    const querySnapshot = await getDocs(q);
    let roomId = '';
    querySnapshot.forEach((doc) => {
      roomId = doc.id;
    });
    await updateDoc(doc(roomsRef, roomId), {
      roomInfo: {
        name: newData.name,
        address: newData.address,
        des: newData.des,
        electricity: newData.electricity,
        water: newData.water,
        security: newData.security,
        garbage: newData.garbage,
      },
    });
    return true;
  } catch (ex) {
    return false;
  }
}

export async function getRoomByCateID(id) {
  try {
    const roomRef = collection(db, 'rooms');
    const q = query(roomRef, where('categoryID', 'array-contains', id));
    const querySnapshot = await getDocs(q);
    let rooms = [];
    for (const doc of querySnapshot.docs) {
      const images = await getImageByRoomAndOrder(doc.id);
      rooms.push({
        id: doc.id,
        data: doc.data(),
        imgs: images,
      });
    }
    return rooms;
  } catch (ex) {
    return undefined;
  }
}
export async function getRoomOwner(userName, cateID) {
  try {
    const roomRef = collection(db, 'rooms');
    const q = query(roomRef, where('createdBy', '==', userName), where('categoryID', 'array-contains', cateID));
    const querySnapshot = await getDocs(q);
    let rooms = [];
    for (const doc of querySnapshot.docs) {
      const images = await getImageByRoomAndOrder(doc.id);
      const renter = await getRenterOfRoom(doc.id);
      const host = await getUserByUsername(userName);
      rooms.push({
        data: doc.data(),
        imgs: images,
        renters: renter,
        host: host,
      });
    }
    return rooms;
  } catch (ex) {
    console.error('Error fetching room owner data:', ex);
    return undefined;
  }
}

export async function updateRoomStatus(roomID, status) {
  try {
    const roomsRef = collection(db, 'rooms');
    const q = query(roomsRef, where('id', '==', roomID));
    const querySnapshot = await getDocs(q);
    let roomId = '';
    querySnapshot.forEach((doc) => {
      roomId = doc.id;
    });
    await updateDoc(doc(roomsRef, roomId), {
      status: status ? 1 : 0,
    });
    return true;
  } catch (ex) {
    return false;
  }
}
export async function disableMotelRoom(roomID, motelRoomID, status) {
  try {
    const roomsRef = collection(db, 'rooms');
    const q = query(roomsRef, where('id', '==', roomID));
    const querySnapshot = await getDocs(q);
    let roomId = '';
    querySnapshot.forEach((doc) => {
      roomId = doc.id;
    });
    const roomRef = doc(roomsRef, roomId);
    const roomDoc = await getDoc(roomRef);
    const roomData = roomDoc.data();
    const updatedRoomsList = roomData.roomsList.map((room) => {
      if (room.motelRoomID === motelRoomID) {
        return {
          ...room,
          status: status ? 1 : 0,
        };
      }
      return room;
    });
    await updateDoc(doc(roomsRef, roomId), {
      roomsList: updatedRoomsList,
    });
    return true;
  } catch (ex) {
    return false;
  }
}
export async function addRoomArea(newRoomArea) {
  try {
    const docRef = await addDoc(collection(db, 'rooms'), newRoomArea.infoRoom);
    const generatedId = docRef.id;
    await updateDoc(doc(db, 'rooms', generatedId), { id: generatedId });
    await addMainImg(newRoomArea.urlImage, generatedId);
    return true;
  } catch (ex) {
    return false;
  }
}

export async function addMotelData(roomID, data) {
  try {
    const roomsRef = collection(db, 'rooms');
    const q = query(roomsRef, where('id', '==', roomID));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      throw new Error('Room not found');
    }

    let roomId = '';
    let currentRoomsList = [];

    querySnapshot.forEach((document) => {
      roomId = document.id;
      currentRoomsList = document.data().roomsList || [];
    });

    const updatedRoomsList = [...currentRoomsList, data.motelData];
    await addMotelImg(data.motelImg);
    await updateDoc(doc(roomsRef, roomId), {
      roomsList: updatedRoomsList,
    });

    return true;
  } catch (ex) {
    console.error('Error updating document: ', ex);
    return false;
  }
}
