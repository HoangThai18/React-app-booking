import db from './firebase';
import { collection, addDoc, query, where, getDocs } from 'firebase/firestore';

export async function addNewBill(billData) {
  try {
    await addDoc(collection(db, 'bills'), billData);
    return true;
  } catch (ex) {
    return false;
  }
}
export async function getRoomBillsData(motelRoomID) {
  try {
    const rentersRef = collection(db, 'bills');
    const q = query(rentersRef, where('motelRoomID', '==', motelRoomID), where('status', '==', 1));
    const querySnapshot = await getDocs(q);

    let bills = [];

    querySnapshot.forEach((doc) => {
      bills.push(doc.data());
    });
    return bills;
  } catch (ex) {
    return [];
  }
}
