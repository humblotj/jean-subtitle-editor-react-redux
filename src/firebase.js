import * as firebase from "firebase";

const config = {
  apiKey: "AIzaSyDCo6jnn2pbiXmRIpoDCgysJ7XWP38MJi4",
  authDomain: "jean-subtitle-editor.firebaseapp.com",
  databaseURL: "https://jean-subtitle-editor.firebaseio.com",
  projectId: "jean-subtitle-editor",
  storageBucket: "jean-subtitle-editor.appspot.com",
  messagingSenderId: "440951111450",
  appId: "1:440951111450:web:05db1d97cf7773f7b936a3",
  measurementId: "G-0NXMB8NBQ2"
};

firebase.initializeApp(config);
export const databaseRef = firebase.database().ref();
