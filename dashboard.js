import { initializeApp } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-auth.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-firestore.js";

// Your Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyCR2uFqndXNM2Gehaujn3ftgY0_MMj-_B8",
  authDomain: "login-page-37267.firebaseapp.com",
  projectId: "login-page-37267",
  storageBucket: "login-page-37267.appspot.com",
  messagingSenderId: "819577914476",
  appId: "1:819577914476:web:938af00a536c620ce5c449",
  measurementId: "G-8CWHQREF5F"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Fetch user's Firestore data and display name
onAuthStateChanged(auth, async (user) => {
  if (user) {
    const userRef = doc(db, "users", user.uid);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      const data = userSnap.data();
      const username = data.username || "User";
      document.getElementById("welcome-user").textContent = `Hello, ${username}`;
    } else {
      document.getElementById("welcome-user").textContent = "Hello, User";
    }
  } else {
    // Not logged in
    window.location.href = "index.html";
  }
});




