import db from './firebase';
import {
  collection,
  addDoc,
  getDoc,
  getDocs,
  query,
  orderBy,
  updateDoc,
  doc,
  where,
  onSnapshot,
  setDoc,
} from 'firebase/firestore';

export async function getChatRoom(callback, uID) {
  try {
    const groupMsgRef = query(collection(db, 'groupMsg'));
    const q = query(groupMsgRef, where('members', 'array-contains', uID), orderBy('modified', 'desc'));

    const unsubscribe = onSnapshot(q, (QuerySnapshot) => {
      const fetchedMsg = [];
      QuerySnapshot.forEach((doc) => {
        fetchedMsg.push({ ...doc.data(), id: doc.id });
      });
      callback(fetchedMsg);
    });
    return () => unsubscribe();
  } catch (ex) {
    return [];
  }
}
export async function addRoomChat(newRoomData) {
  try {
    const docRef = await addDoc(collection(db, 'groupMsg'), newRoomData);
    const newData = { ...newRoomData, roomChatID: docRef.id };
    await setDoc(doc(db, 'groupMsg', docRef.id), newData);
    return true;
  } catch (ex) {
    console.error('Error adding room:', ex);
    return false;
  }
}

export async function getMembersChatRoom(callback, roomChatID) {
  try {
    const msgRef = query(collection(db, 'groupMsg'));
    const q = query(msgRef, where('roomChatID', '==', roomChatID));

    const unsubscribe = onSnapshot(q, (QuerySnapshot) => {
      const fetchedMsg = [];
      QuerySnapshot.forEach((doc) => {
        fetchedMsg.push({ ...doc.data(), id: doc.id });
      });
      callback(fetchedMsg);
    });
    return () => unsubscribe();
  } catch (ex) {
    return [];
  }
}
export async function updateRoomChatMod(roomChatID) {
  try {
    const roomsRef = collection(db, 'groupMsg');
    const q = query(roomsRef, where('roomChatID', '==', roomChatID));
    const querySnapshot = await getDocs(q);
    let roomChatId = null;
    querySnapshot.forEach((doc) => {
      roomChatId = doc.id;
    });
    await updateDoc(doc(roomsRef, roomChatId), {
      modified: Date.now(),
    });
    return true;
  } catch (ex) {
    return false;
  }
}

export async function updateRoomChatName(roomChatID, groupName) {
  try {
    const roomsRef = collection(db, 'groupMsg');
    const q = query(roomsRef, where('roomChatID', '==', roomChatID));
    const querySnapshot = await getDocs(q);
    let roomName = '';
    querySnapshot.forEach((doc) => {
      roomName = doc.id;
    });
    await updateDoc(doc(roomsRef, roomName), {
      groupName: groupName,
    });
    return true;
  } catch (ex) {
    return false;
  }
}

export async function addMoreMembers(roomChatID, memberList) {
  try {
    const roomsRef = collection(db, 'groupMsg');
    const q = query(roomsRef, where('roomChatID', '==', roomChatID));
    const querySnapshot = await getDocs(q);
    let roomId = '';
    querySnapshot.forEach((doc) => {
      roomId = doc.id;
    });
    const roomDoc = doc(roomsRef, roomId);
    const existingMembers = (await getDoc(roomDoc)).data()?.members || [];
    const newMembers = memberList.filter((user) => !existingMembers.includes(user.uID)).map((user) => user.uID);
    const updatedMembers = existingMembers.concat(newMembers);
    await updateDoc(roomDoc, {
      members: updatedMembers,
    });
    return true;
  } catch (ex) {
    console.error(ex);
    return false;
  }
}
