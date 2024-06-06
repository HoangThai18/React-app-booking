import db from './firebase';
import { collection, getDocs, query, where, orderBy, addDoc, updateDoc, doc } from 'firebase/firestore';

export async function addMotelImg(data) {
  try {
    await addDoc(collection(db, 'images'), data);
    return true;
  } catch (ex) {
    return false;
  }
}
export async function addMainImg(data, id) {
  try {
    const newData = { ...data, roomID: id };
    await addDoc(collection(db, 'images'), newData);
    return true;
  } catch (ex) {
    console.error('Error adding document: ', ex);
    return false;
  }
}

export async function getImageByRoomAndOrder(roomID) {
  try {
    const imgRef = collection(db, 'images');
    const q = query(imgRef, where('roomID', '==', roomID), orderBy('created'));
    const querySnapshot = await getDocs(q);

    let imgs = [];

    querySnapshot.forEach((doc) => {
      imgs.push({
        id: doc.id,
        data: doc.data(),
      });
    });
    return imgs;
  } catch (ex) {
    return [];
  }
}
export async function getImageByMotelID(motelRoomID) {
  try {
    const imgRef = collection(db, 'images');
    const q = query(imgRef, where('motelRoomID', '==', motelRoomID));
    const querySnapshot = await getDocs(q);
    let imgs = null;
    querySnapshot.forEach((doc) => {
      imgs = doc.data();
    });
    return imgs;
  } catch (ex) {
    return [];
  }
}
export async function updateUrlMotelRoom(motelRoomId, urlMotelImg) {
  try {
    const imgRef = collection(db, 'images');
    const q = query(imgRef, where('motelRoomID', '==', motelRoomId));
    const querySnapshot = await getDocs(q);
    let motelRoomID = [];
    querySnapshot.forEach((doc) => {
      motelRoomID = doc.id;
    });
    await updateDoc(doc(imgRef, motelRoomID), {
      src: urlMotelImg.src,
    });
    return true;
  } catch (ex) {
    return [];
  }
}
