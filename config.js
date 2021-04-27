import * as firebase from 'firebase'

require('@firebase/firestore')
var firebaseConfig = {
  apiKey: "AIzaSyA1tNkjnv-mTIKz-ADijLGeuxhiR3glmzw",
  authDomain: "booksanta-app-s.firebaseapp.com",
  projectId: "booksanta-app-s",
  storageBucket: "booksanta-app-s.appspot.com",
  messagingSenderId: "98638950046",
  appId: "1:98638950046:web:6ad2fee74342d2873f958f"

},
if(!firebase.apps.lenghth){
firebase.initializeApp(firebaseConfig);
}