import db from './firebase';
import { collection, addDoc, query, getDocs, where, updateDoc, doc } from 'firebase/firestore';

export async function addRenter(motelRoomID, data) {
  try {
    const renterQuery = query(
      collection(db, 'renters'),
      where('motelRoomID', '==', motelRoomID),
      where('status', '==', 1)
    );

    const renterQuerySnapshot = await getDocs(renterQuery);

    let renters = [];
    renterQuerySnapshot.forEach((doc) => {
      renters.push(doc.data());
    });

    const isExistingRenter = renters.some(
      (renter) => renter.userName === data.userName && renter.motelRoomID === data.motelRoomID
    );
    if (isExistingRenter) {
      return false;
    } else {
      await addDoc(collection(db, 'renters'), data);
      return true;
    }
  } catch (ex) {
    console.error('Error adding renter:', ex);
    return false;
  }
}

export async function getRentersData(roomID) {
  try {
    const rentersRef = collection(db, 'renters');
    const q = query(rentersRef, where('roomID', '==', roomID), where('status', '==', 1));
    const querySnapshot = await getDocs(q);

    let renters = [];

    querySnapshot.forEach((doc) => {
      renters.push(doc.data());
    });
    return renters;
  } catch (ex) {
    return [];
  }
}
export async function getRentersRented(motelRoomID) {
  try {
    const rentersRef = collection(db, 'renters');
    const q = query(rentersRef, where('motelRoomID', '==', motelRoomID), where('isRenter', '==', 1));
    const querySnapshot = await getDocs(q);

    let renter = null;

    querySnapshot.forEach((doc) => {
      renter = doc.data();
    });
    return renter;
  } catch (ex) {
    return [];
  }
}
export async function getRenterByUserName(userName) {
  try {
    const rentersRef = collection(db, 'renters');
    const q = query(rentersRef, where('userName', '==', userName), where('isRenter', '==', 1));
    const querySnapshot = await getDocs(q);

    let renter = null;

    querySnapshot.forEach((doc) => {
      renter = doc.data();
    });

    return renter;
  } catch (ex) {
    console.error('Error fetching renter by userName:', ex);
    return null;
  }
}
export async function getRenterOfRoom(roomID) {
  try {
    const rentersRef = collection(db, 'renters');
    const q = query(rentersRef, where('roomID', '==', roomID), where('isRenter', '==', 1));
    const querySnapshot = await getDocs(q);
    let renter = [];
    querySnapshot.forEach((doc) => {
      renter.push(doc.data());
    });
    return renter;
  } catch (ex) {
    return [];
  }
}
export async function setRenter(motelRoomID, userName) {
  try {
    const roomsRef = collection(db, 'renters');
    const q = query(roomsRef, where('motelRoomID', '==', motelRoomID), where('userName', '==', userName));
    const querySnapshot = await getDocs(q);
    let renterID = '';
    querySnapshot.forEach((doc) => {
      renterID = doc.id;
    });
    await updateDoc(doc(roomsRef, renterID), {
      isRenter: 1,
    });
    return true;
  } catch (ex) {
    return false;
  }
}

export async function cleanRenters(motelRoomID) {
  try {
    const roomsRef = collection(db, 'renters');
    const q = query(roomsRef, where('motelRoomID', '==', motelRoomID));
    const querySnapshot = await getDocs(q);

    for (const renterDoc of querySnapshot.docs) {
      await updateDoc(doc(db, 'renters', renterDoc.id), {
        status: 0,
        isRenter: 0,
      });
    }

    return true;
  } catch (ex) {
    console.error('Error updating documents: ', ex);
    return false;
  }
}
export async function removeRenter(motelRoomID, userName) {
  try {
    const roomsRef = collection(db, 'renters');
    const q = query(roomsRef, where('motelRoomID', '==', motelRoomID), where('userName', '==', userName));
    const querySnapshot = await getDocs(q);
    let renterID = '';
    querySnapshot.forEach((doc) => {
      renterID = doc.id;
    });
    await updateDoc(doc(roomsRef, renterID), {
      status: 0,
    });
    return true;
  } catch (ex) {
    return false;
  }
}
