import db from './firebase';
import { collection, addDoc, query, where, getDocs, orderBy } from 'firebase/firestore';

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
    const q = query(rentersRef, where('motelRoomID', '==', motelRoomID), where('status', '==', 1), orderBy('created'));
    const querySnapshot = await getDocs(q);

    let bills = [];

    querySnapshot.forEach((doc) => {
      bills.push(doc.data());
    });
    const reverseBills = bills.reverse();
    return reverseBills;
  } catch (ex) {
    return [];
  }
}
export async function getRenterBill(motelRoomID, userName) {
  try {
    const billsRef = collection(db, 'bills');
    const q = query(
      billsRef,
      where('motelRoomID', '==', motelRoomID),
      where('renter.userName', '==', userName),
      orderBy('created')
    );
    const querySnapshot = await getDocs(q);

    const bills = [];
    querySnapshot.forEach((doc) => {
      bills.push(doc.data());
    });
    const sortedbill = bills.reverse();
    return sortedbill;
  } catch (error) {
    console.error('Error fetching bills:', error);
    return [];
  }
}
