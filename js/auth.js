import { auth } from "./firebase.js";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signOut,
  signInWithPopup,
  sendPasswordResetEmail
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

const provider = new GoogleAuthProvider();

/* HELPERS */
const showFieldError = (id, message) => {
  const field = document.getElementById(id)?.closest(".field");
  if (!field) return;

  field.classList.remove("error");
  void field.offsetWidth; // re-trigger animation
  field.classList.add("error");

  field.querySelector(".field-error").innerText = message;
};

const clearErrors = () => {
  document.querySelectorAll(".field").forEach(f => {
    f.classList.remove("error");
    const err = f.querySelector(".field-error");
    if (err) err.innerText = "";
  });
};

/* LOGIN */
window.login = () => {
  clearErrors();

  const email = emailEl.value.trim();
  const password = passwordEl.value.trim();

  if (!email) return showFieldError("email", "Email is required");
  if (!password) return showFieldError("password", "Password is required");

  signInWithEmailAndPassword(auth, email, password)
    .then(() => location.href = "index.html")
    .catch(err => {
      if (err.code.includes("user-not-found"))
        showFieldError("email", "Account not found");
      else if (err.code.includes("wrong-password"))
        showFieldError("password", "Incorrect password");
      else showFieldError("email", err.message);
    });
};

/* SIGNUP */
window.signup = () => {
  clearErrors();

  const email = emailEl.value.trim();
  const password = passwordEl.value.trim();
  const confirm = confirmPassword.value.trim();

  if (!email) return showFieldError("email", "Email required");
  if (password.length < 6)
    return showFieldError("password", "Minimum 6 characters");
  if (password !== confirm)
    return showFieldError("confirmPassword", "Passwords do not match");

  createUserWithEmailAndPassword(auth, email, password)
    .then(() => location.href = "index.html")
    .catch(err => showFieldError("email", err.message));
};

/* GOOGLE */
window.googleLogin = () => {
  signInWithPopup(auth, provider)
    .then(() => location.href = "index.html")
    .catch(err => alert(err.message));
};

/* RESET PASSWORD */
window.resetPassword = () => {
  clearErrors();
  if (!emailEl.value)
    return showFieldError("email", "Enter email first");

  sendPasswordResetEmail(auth, emailEl.value)
    .then(() => alert("Password reset email sent"))
    .catch(err => showFieldError("email", err.message));
};

/* LOGOUT */
window.logout = () => {
  signOut(auth).then(() => {
    window.location.href = "login.html";
  });
};

/* TOGGLE PASSWORD */
window.togglePassword = () => {
  password.type = password.type === "password" ? "text" : "password";
};
