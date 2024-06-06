import db from './firebase';
import { collection, getDocs, addDoc, query, where, updateDoc, doc, onSnapshot } from 'firebase/firestore';

// Login
export async function userLogin(username, pw) {
  try {
    const userRef = collection(db, 'users');
    const q = query(userRef, where('username', '==', username), where('password', '==', pw));
    const querySnapshot = await getDocs(q);
    let user;
    querySnapshot.forEach((doc) => {
      user = doc.data();
    });
    return user;
  } catch (ex) {
    return undefined;
  }
}

// Get Data
export async function getUserByUsername(username) {
  try {
    const userRef = collection(db, 'users');
    const q = query(userRef, where('username', '==', username));
    const querySnapshot = await getDocs(q);
    let user;
    querySnapshot.forEach((doc) => {
      user = doc.data();
    });
    return user;
  } catch (ex) {
    return undefined;
  }
}

// Add Data
export async function addNewUser(userData) {
  try {
    await addDoc(collection(db, 'users'), userData);
    return true;
  } catch (ex) {
    return false;
  }
}

// Update password
export async function updatePassword(username, password) {
  try {
    const usersRef = collection(db, 'users');
    const q = query(usersRef, where('username', '==', username));
    const querySnapshot = await getDocs(q);
    let userId = '';
    querySnapshot.forEach((doc) => {
      userId = doc.id;
    });
    await updateDoc(doc(usersRef, userId), {
      password: password,
    });
    return true;
  } catch (ex) {
    return false;
  }
}

// Get uselist
export async function getUserList() {
  try {
    const usersRef = collection(db, 'users');
    const querySnapshot = await getDocs(usersRef);

    const userList = [];

    querySnapshot.forEach((doc) => {
      const userData = doc.data();
      if (userData.username !== 'a') {
        userList.unshift({ id: doc.id, ...userData });
      }
    });
    return userList;
  } catch (ex) {
    return null;
  }
}

// Update user info
export async function updateUserData(username, newData) {
  try {
    const usersRef = collection(db, 'users');
    const q = query(usersRef, where('username', '==', username));
    const querySnapshot = await getDocs(q);
    let userId = '';
    querySnapshot.forEach((doc) => {
      userId = doc.id;
    });
    await updateDoc(doc(usersRef, userId), {
      address: newData.address,
      fullName: newData.fullName,
      email: newData.email,
      gender: newData.gender,
      company: newData.company,
      phone: newData.phone,
      urlImg: newData.urlImg,
    });
    return true;
  } catch (ex) {
    return false;
  }
}

// Update user status
export async function updateUserActive(username, isActive) {
  try {
    const usersRef = collection(db, 'users');
    const q = query(usersRef, where('username', '==', username));
    const querySnapshot = await getDocs(q);
    let userId = '';
    querySnapshot.forEach((doc) => {
      userId = doc.id;
    });
    await updateDoc(doc(usersRef, userId), {
      isActive: isActive ? 1 : 0,
    });
    return true;
  } catch (ex) {
    return false;
  }
}

// Check username
export async function checkUserName(username) {
  try {
    const userRef = collection(db, 'users');
    const q = query(userRef, where('username', '==', username));
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      return true;
    } else {
      return false;
    }
  } catch (ex) {
    return undefined;
  }
}

export async function searchUsersByEmail(callback, input, uIDs) {
  try {
    const userRef = collection(db, 'users');
    const q = query(userRef, where('email', '>=', input), where('email', '<=', input + '\uf8ff'));

    const unsubscribe = onSnapshot(q, (QuerySnapshot) => {
      const fetchedUsers = [];
      QuerySnapshot.forEach((doc) => {
        const userData = { ...doc.data(), id: doc.id };
        if (!uIDs.includes(userData.uID)) {
          fetchedUsers.push(userData);
        }
      });
      callback(fetchedUsers);
    });
    return () => unsubscribe();
  } catch (ex) {
    console.error(ex);
    return () => {};
  }
}
