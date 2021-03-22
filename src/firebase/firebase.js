import firebase from 'firebase/app';
import "firebase/database";
import "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDNYv0GNZxYoJNhC9Z7vYxCll92Bs5hK54",
  authDomain: "munchkinrealtime.firebaseapp.com",
  databaseURL: "https://munchkinrealtime-default-rtdb.firebaseio.com",
  projectId: "munchkinrealtime",
  storageBucket: "munchkinrealtime.appspot.com",
  messagingSenderId: "1028055506111",
  appId: "1:1028055506111:web:35385513c03f849b60fa0a"
};

firebase.initializeApp(firebaseConfig);

let database = firebase.database();
let firebaseUser = firebase.auth().currentUser;

async function writeUserData({uid, displayName, email, photoURL, avatar, nickname}) {
  try {
    database.ref('users/' + uid).set({
      displayName: displayName,
      email: email,
      photoURL: photoURL,
      avatar: avatar,
      nickname: nickname,
      uid: uid
      // Add more stuff here
    }, (error) => {
      if(error) {
        console.log(error)
      } else {
        console.log('Data saved successfully!');
      }
    });
    return 'Данные сохранены!'
  } catch (error) {
    console.log('error: ', error);
    return 'error'
  }
}


async function getUserData() {

  let userData;
  let userId = firebase.auth().currentUser.uid;
  if (!userId) {
    return
  }
  await database.ref("users").child(userId).get().then( (snapshot) => {
    if (snapshot.exists()) {
      userData = Object.assign({}, snapshot.val());
    }
    else {
      console.log("No data available");
    }
  }).catch(function(error) {
    console.error(error);
  });

  return userData;
}



let authProvider = new firebase.auth.GoogleAuthProvider();


export {database, authProvider, writeUserData, getUserData}

export default firebase;