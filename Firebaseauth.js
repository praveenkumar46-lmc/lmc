// Import Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-analytics.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/11.9.1/firebase-auth.js";
import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  collection,
  addDoc,
  query,
  where,
  getDocs
} from "https://www.gstatic.com/firebasejs/11.9.1/firebase-firestore.js";

// Firebase configuration
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
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);

// 🔐 Registration
const registerForm = document.querySelector('#signup form');
if (registerForm) {
  registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = document.getElementById("reg-email").value.trim();
    const password = document.getElementById("reg-password").value.trim();
    const username = document.getElementById("reg-username").value.trim();
    const userId = document.getElementById("reg-user-id").value.trim();
    const mobile = document.getElementById("reg-mobile").value.trim();

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await setDoc(doc(db, "users", user.uid), {
        email,
        username,
        userId,
        mobile
      });

      document.getElementById("signup").style.display = "none";
      document.getElementById("signin").style.display = "block";
    } catch (error) {
      alert("Registration failed: " + error.message);
    }
  });
}

// 🔓 Login
const loginForm = document.querySelector('#signin form');
if (loginForm) {
  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = document.getElementById("login-email").value.trim();
    const password = document.getElementById("login-password").value.trim();
    const loginUserId = document.getElementById("login-user-id").value.trim();

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      const userDoc = await getDoc(doc(db, "users", user.uid));
      if (userDoc.exists()) {
        const data = userDoc.data();
        if (data.userId === loginUserId) {
          window.location.href = "home.html";
        } else {
          alert("User ID does not match.");
        }
      } else {
        alert("User data not found.");
      }
    } catch (error) {
      alert("Login failed: " + error.message);
    }
  });
}

// 🧠 Quiz submission handler
const quizForm = document.getElementById("quizForm");
if (quizForm) {
  quizForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const user = auth.currentUser;
    if (!user) {
      alert("Please login to take the quiz.");
      return;
    }

    const userSnap = await getDoc(doc(db, "users", user.uid));
    if (!userSnap.exists()) {
      alert("User data not found in Firestore.");
      return;
    }

    const userData = userSnap.data();
    const username = userData.username || "Unknown";
    const email = user.email;
    const mobile = userData.mobile || "N/A";

    // Get selected testId
    const testId = document.getElementById("testSelector").value;
    if (!testId) {
      alert("Please select a test.");
      return;
    }

    // 🛑 Check if username has already taken this specific test
    const resultQuery = query(
      collection(db, "quiz_results"),
      where("username", "==", username),
      where("testId", "==", testId)
    );
    const existingResult = await getDocs(resultQuery);
    if (!existingResult.empty) {
      alert(`⚠️ You have already submitted ${testId}.`);
      return;
    }

    // ✅ Correct answers based on testId
    let correctAnswers = {};
    if (testId === "test1") {
      correctAnswers = {
        q1: "Delhi",
        q2: "4",
        q3: "Hyper Text Markup Language"
      };
    } else if (testId === "test2") {
      correctAnswers = {
        q1: "Mars",
        q2: "Cascading Style Sheets",
        q3: "9"
      };
    } else {
      alert("Invalid test selected.");
      return;
    }

    // ✅ Calculate score
    let score = 0;
    const total = Object.keys(correctAnswers).length;
    for (let i = 1; i <= total; i++) {
      const selected = document.querySelector(`input[name="q${i}"]:checked`);
      if (selected && selected.value === correctAnswers[`q${i}`]) {
        score++;
      }
    }

    const percentage = ((score / total) * 100).toFixed(2);

    document.getElementById("result").innerHTML = `
      Your Score: ${score}/${total}<br>
      Percentage: ${percentage}%<br>
      ${
        percentage >= 75
          ? "<span style='color:green;'>🎉 You passed!</span>"
          : "<span style='color:red;'>❌ Try again next time.</span>"
      }
    `;

    // 💾 Save result regardless of pass/fail
    await addDoc(collection(db, "quiz_results"), {
      username,
      testId,
      email,
      mobile,
      score,
      percentage,
      date: new Date().toLocaleDateString()
    });

    alert(`✅ ${testId} result saved. You cannot attempt this test again.`);
    quizForm.reset();
  });
}

// 🔍 Monitor auth state
onAuthStateChanged(auth, (user) => {
  console.log(user ? `Logged in: ${user.email}` : "No user logged in.");
});
