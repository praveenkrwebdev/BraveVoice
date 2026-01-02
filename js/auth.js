import { auth } from "./firebase.js";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  sendPasswordResetEmail
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

const provider = new GoogleAuthProvider();

/* ---------- DOM HELPERS ---------- */
const getEmail = () => document.getElementById("email");
const getPassword = () => document.getElementById("password");
const getConfirmPassword = () =>
  document.getElementById("confirmPassword");

/* ---------- ERROR HELPERS ---------- */
const showFieldError = (id, message) => {
  const field = document.getElementById(id)?.closest(".field");
  if (!field) return;

  field.classList.remove("error");
  void field.offsetWidth; // retrigger animation
  field.classList.add("error");

  const errorEl = field.querySelector(".field-error");
  if (errorEl) errorEl.innerText = message;
};

const clearErrors = () => {
  document.querySelectorAll(".field").forEach(field => {
    field.classList.remove("error");
    const error = field.querySelector(".field-error");
    if (error) error.innerText = "";
  });
};

/* ---------- LOGIN ---------- */
window.login = () => {
  clearErrors();

  const emailEl = getEmail();
  const passwordEl = getPassword();

  const email = emailEl?.value.trim();
  const password = passwordEl?.value.trim();

  if (!email) return showFieldError("email", "Email is required");
  if (!password) return showFieldError("password", "Password is required");

  signInWithEmailAndPassword(auth, email, password)
    .then(() => (location.href = "index.html"))
    .catch(err => {
      if (err.code === "auth/user-not-found") {
        showFieldError("email", "Account not found");
      } else if (err.code === "auth/wrong-password") {
        showFieldError("password", "Incorrect password");
      } else {
        showFieldError("email", err.message);
      }
    });
};

/* ---------- SIGNUP ---------- */
window.signup = () => {
  clearErrors();

  const emailEl = getEmail();
  const passwordEl = getPassword();
  const confirmEl = getConfirmPassword();

  const email = emailEl?.value.trim();
  const password = passwordEl?.value.trim();
  const confirm = confirmEl?.value.trim();

  if (!email) return showFieldError("email", "Email is required");
  if (!password || password.length < 6)
    return showFieldError("password", "Minimum 6 characters");
  if (password !== confirm)
    return showFieldError("confirmPassword", "Passwords do not match");

  createUserWithEmailAndPassword(auth, email, password)
    .then(() => (location.href = "index.html"))
    .catch(err => showFieldError("email", err.message));
};

/* ---------- GOOGLE LOGIN ---------- */
window.googleLogin = () => {
  signInWithPopup(auth, provider)
    .then(() => (location.href = "index.html"))
    .catch(err => alert(err.message));
};

/* ---------- RESET PASSWORD ---------- */
window.resetPassword = () => {
  clearErrors();

  const emailEl = getEmail();
  const email = emailEl?.value.trim();

  if (!email) return showFieldError("email", "Enter email first");

  sendPasswordResetEmail(auth, email)
    .then(() => alert("Password reset email sent"))
    .catch(err => showFieldError("email", err.message));
};

/* ---------- TOGGLE PASSWORD ---------- */
window.togglePassword = () => {
  const passwordEl = getPassword();
  if (!passwordEl) return;

  passwordEl.type =
    passwordEl.type === "password" ? "text" : "password";
};
