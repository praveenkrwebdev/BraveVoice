import { auth } from "./firebase.js";
import {
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

const emailSpan = document.getElementById("userEmail");
const avatarImg = document.getElementById("userAvatar");

// 🔐 Protect page + show user info
onAuthStateChanged(auth, (user) => {
  if (!user) {
    window.location.href = "login.html";
    return;
  }

  // Show email
  if (emailSpan) {
    emailSpan.textContent = user.email || "Anonymous";
  }

  // Show avatar
  if (avatarImg) {
    avatarImg.src = user.photoURL
      ? user.photoURL
      : "https://ui-avatars.com/api/?name=" + encodeURIComponent(user.email || "User");
  }
});

// 🚪 Logout
window.logout = () => {
  signOut(auth).then(() => {
    window.location.href = "login.html";
  });
};
