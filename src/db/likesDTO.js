import db from './firebase';
import { collection, getDocs, query, where, updateDoc, doc, addDoc, orderBy } from 'firebase/firestore';

export async function addNewLike(likeData) {
  try {
    await addDoc(collection(db, 'likes'), likeData);
    return true;
  } catch (ex) {
    return false;
  }
}

export async function getRoomsLikedByUser(username) {
  try {
    const roomRef = collection(db, 'likes');
    const roomsMap = new Map();
    const q = query(
      roomRef,
      where('user.username', '==', username),
      where('status', '==', 1),
      orderBy('modified', 'desc')
    );
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      const roomID = data.roomID;
      if (!roomsMap.has(roomID) || data.modified > roomsMap.get(roomID).modified) {
        roomsMap.set(roomID, data);
      }
    });
    const rooms = Array.from(roomsMap.values());
    return rooms;
  } catch (ex) {
    return undefined;
  }
}

export async function unLikeRoom(roomID, username) {
  try {
    const likesRef = collection(db, 'likes');
    const q = query(
      likesRef,
      where('roomID', '==', roomID),
      where('user.username', '==', username),
      where('status', '==', 1)
    );
    const querySnapshot = await getDocs(q);
    if (querySnapshot) {
      let likeId = '';
      querySnapshot.forEach((doc) => {
        likeId = doc.id;
      });
      await updateDoc(doc(likesRef, likeId), {
        status: 0,
        modified: Date.now(),
        modifiedBy: username,
      });
      return true;
    }
  } catch (ex) {}
  return false;
}
export async function listLikes(roomID) {
  try {
    const likesRef = collection(db, 'likes');
    const q = query(likesRef, where('roomID', '==', roomID), where('status', '==', 1), orderBy('modified', 'desc'));
    const querySnapshot = await getDocs(q);
    let likesDataArray = [];
    querySnapshot.forEach((doc) => {
      const likeData = doc.data();
      const isExisting = likesDataArray.some((item) => item.username === likeData.user.username);
      if (!isExisting) {
        likesDataArray.push(likeData);
      }
    });
    return { usersLiked: likesDataArray };
  } catch (ex) {
    return false;
  }
}
