import * as firebase from "firebase/app"
import "firebase/auth"


const firebaseConfig = {
    apiKey: "AIzaSyALADm9ATZRhAnKrmtsqgpLFcsW2K64ATs",
    authDomain: "movie2-86b1d.firebaseapp.com",
    databaseURL: "https://movie2-86b1d.firebaseio.com",
    projectId: "movie2-86b1d",
    storageBucket: "movie2-86b1d.appspot.com",
    messagingSenderId: "723415161585",
    appId: "1:723415161585:web:4eec3d49159d05ef792750"
}

firebase.initializeApp(firebaseConfig);

export default firebase;
