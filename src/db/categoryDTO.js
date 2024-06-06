import db from './firebase';
import { collection, getDocs, query } from 'firebase/firestore';

export async function getCategoryData() {
  try {
    const userRef = collection(db, 'categories');
    const q = query(userRef);
    const querySnapshot = await getDocs(q);

    let cate = [];

    querySnapshot.forEach((doc) => {
      cate.push(doc.data());
    });
    return cate;
  } catch (ex) {
    return [];
  }
}
export async function getCateID() {
  try {
    const userRef = collection(db, 'categories');
    const q = query(userRef);
    const querySnapshot = await getDocs(q);

    let rooms = [];

    querySnapshot.forEach((doc) => {
      rooms.push(doc.id);
    });
    return rooms;
  } catch (ex) {
    console.error('Error fetching rooms:', ex);
    return [];
  }
}
export async function getCate() {
  try {
    const cateRef = collection(db, 'categories');
    const q = query(cateRef);
    const querySnapshot = await getDocs(q);

    let cate = [];

    querySnapshot.forEach((doc) => {
      cate.push({
        id: doc.id,
        data: doc.data(),
      });
    });
    return cate;
  } catch (ex) {
    return [];
  }
}
