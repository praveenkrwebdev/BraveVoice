import { auth } from "./firebase.js";
import {
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

const emailSpan = document.getElementById("userEmail");
const avatarImg = document.getElementById("userAvatar");

// 🔐 Auth Guard (NO FLASH FIX)
onAuthStateChanged(auth, (user) => {
  if (!user) {
    window.location.replace("login.html");
    return;
  }

  // ✅ Show page ONLY after auth confirmed
  document.body.style.visibility = "visible";

  if (emailSpan) {
    emailSpan.textContent = user.email || "Anonymous";
  }

  if (avatarImg) {
    avatarImg.src = user.photoURL
      ? user.photoURL
      : "https://ui-avatars.com/api/?name=" +
        encodeURIComponent(user.email || "User");
  }
});

// 🚪 Logout
window.logout = () => {
  signOut(auth).then(() => {
    window.location.replace("login.html");
  });
};
