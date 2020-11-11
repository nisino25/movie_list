import { ref } from 'vue'
import firebase from 'firebase'

firebase.initializeApp(
  {
    apiKey: "AIzaSyDI8O0QgKOZSuOiq9MEYiQ-h6Jrq2uOxxQ",
    authDomain: "legit-movie-list.firebaseapp.com",
    databaseURL: "https://legit-movie-list.firebaseio.com",
    projectId: "legit-movie-list",
    storageBucket: "legit-movie-list.appspot.com",
    messagingSenderId: "780228277196",
    appId: "1:780228277196:web:09c0ef56d59098d56e6369"
  }
)

export const AuthStore = ref({
  currentUser: null
})
export const auth = firebase.auth()
export const db = firebase.firestore()

auth.onAuthStateChanged(user => {
  AuthStore.value.currentUser = user
})
