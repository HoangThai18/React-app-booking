import db from './firebase';
import { collection, addDoc, query, orderBy, limit, onSnapshot, where, startAfter } from 'firebase/firestore';

export async function addNewMsg(msgData) {
  try {
    await addDoc(collection(db, 'messages'), msgData);
    return true;
  } catch (ex) {
    return false;
  }
}

export async function getMsgData(callback, chatRoomID, msgLength) {
  try {
    const msgRef = query(collection(db, 'messages'));
    const q = query(msgRef, where('chatRoomID', '==', chatRoomID), orderBy('created', 'desc'), limit(msgLength));

    const unsubscribe = onSnapshot(q, (QuerySnapshot) => {
      const fetchedMsg = [];
      QuerySnapshot.forEach((doc) => {
        fetchedMsg.push({ ...doc.data(), id: doc.id });
      });
      const sortedMsg = fetchedMsg.sort((a, b) => a.created - b.created);
      callback(sortedMsg);
    });
    return () => unsubscribe();
  } catch (ex) {
    return [];
  }
}
export async function getMoreMsg(callback, chatRoomID, msgLength, timestamp) {
  try {
    const msgRef = query(collection(db, 'messages'));
    const q = query(
      msgRef,
      where('chatRoomID', '==', chatRoomID),
      orderBy('created', 'desc'),
      startAfter(timestamp),
      limit(msgLength)
    );

    const unsubscribe = onSnapshot(q, (QuerySnapshot) => {
      const fetchedMsg = [];
      QuerySnapshot.forEach((doc) => {
        fetchedMsg.push({ ...doc.data(), id: doc.id });
      });
      const sortedMsg = fetchedMsg.sort((a, b) => a.created - b.created);
      callback(sortedMsg);
    });
    return () => unsubscribe();
  } catch (ex) {
    return [];
  }
}
