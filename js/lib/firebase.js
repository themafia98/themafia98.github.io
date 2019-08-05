import * as firebase from 'firebase/app';
const firestore = require('firebase/firestore');

const config = (()=>{
    const configFirebase = {
    apiKey: "AIzaSyDbccidJ1gkbHlOarCaPQxLZB663DuEkoM",
      authDomain: "game-e444e.firebaseapp.com",
      databaseURL: "https://game-e444e.firebaseio.com",
      projectId: "game-e444e",
      storageBucket: "game-e444e.appspot.com",
      messagingSenderId: "1087306837571"
};
 return configFirebase;
})();
firebase.initializeApp(config());
const db = firebase.firestore();
export {db};