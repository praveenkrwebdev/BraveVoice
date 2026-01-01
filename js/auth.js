import { auth } from "./firebase.js";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendEmailVerification,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

const provider = new GoogleAuthProvider();

const getErrorBox = () => document.getElementById("error");

/* LOGIN */
window.login = () => {
  const email = document.getElementById("email")?.value;
  const password = document.getElementById("password")?.value;
  const errorBox = getErrorBox();

  signInWithEmailAndPassword(auth, email, password)
    .then(() => window.location.href = "index.html")
    .catch(err => {
      if (errorBox) errorBox.innerText = err.message;
      else alert(err.message);
    });
};

/* SIGNUP */
// window.signup = () => {
//   const email = document.getElementById("email")?.value;
//   const password = document.getElementById("password")?.value;
//   const errorBox = getErrorBox();

//   createUserWithEmailAndPassword(auth, email, password)
//     .then(() => window.location.href = "index.html")
//     .catch(err => {
//       if (errorBox) errorBox.innerText = err.message;
//       else alert(err.message);
//     });
// };


/* =====================
   SIGNUP
===================== */
window.signup = async () => {
  clearErrors();

  const confirmPassword = document.getElementById("confirmPassword");
  const confirmPasswordError =
    document.getElementById("confirmPasswordError");
  const btn = document.getElementById("signupBtn");

  if (!email.value.trim())
    return showError(email, emailError, "Email is required");

  if (password.value.length < 6)
    return showError(
      password,
      passwordError,
      "Password must be at least 6 characters"
    );

  if (password.value !== confirmPassword.value)
    return showError(
      confirmPassword,
      confirmPasswordError,
      "Passwords do not match"
    );

  btn.classList.add("loading");

  try {
    const userCred = await createUserWithEmailAndPassword(
      auth,
      email.value.trim(),
      password.value
    );

    /* ✅ SEND VERIFICATION ONLY ON SIGNUP */
    await sendEmailVerification(userCred.user);

    alert("Verification email sent. Please check your inbox.");
    window.location.href = "login.html";

  } catch (err) {
    if (err.code === "auth/email-already-in-use") {
      showError(email, emailError, "Email already registered");
    } else {
      showError(email, emailError, err.message);
    }
    btn.classList.remove("loading");
  }
};


/* GOOGLE LOGIN */
window.googleLogin = () => {
  signInWithPopup(auth, provider)
    .then(() => window.location.href = "index.html")
    .catch(err => alert(err.message));
};

/* 🔑 FORGOT PASSWORD */
window.resetPassword = () => {
  const email = document.getElementById("email")?.value;
  const errorBox = getErrorBox();

  if (!email) {
    errorBox.innerText = "Please enter your email first.";
    return;
  }

  sendPasswordResetEmail(auth, email)
    .then(() => {
      errorBox.style.color = "green";
      errorBox.innerText = "Password reset email sent. Check your inbox.";
    })
    .catch(err => {
      errorBox.style.color = "red";
      errorBox.innerText = err.message;
    });
};

/* LOGOUT */
window.logout = () => {
  signOut(auth).then(() => {
    window.location.href = "login.html";
  });
};

/* AUTH STATE (OPTIONAL BUT BEST PRACTICE) */
onAuthStateChanged(auth, user => {
  if (!user && !location.pathname.includes("login")) {
    window.location.href = "login.html";
  }
    /* 👁️ TOGGLE PASSWORD VISIBILITY */
window.togglePassword = () => {
  const passwordInput = document.getElementById("password");
  if (!passwordInput) return;

  passwordInput.type =
    passwordInput.type === "password" ? "text" : "password";
};
});
