import { initializeApp } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-app.js";

import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-firestore.js";


import { GoogleAuthProvider, signInWithPopup, signInWithRedirect, getRedirectResult } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-auth.js";

import { signInAnonymously } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-auth.js";
import { doc, setDoc } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-firestore.js";

// ✅ Firebase Config
const firebaseConfig = {
  apiKey: "AIzaSyBz1pfYoic75OMUmsQ6KK2Gk14W-K6wsWo",
  authDomain: "healthmate-sign-login.firebaseapp.com",
  projectId: "healthmate-sign-login",
  storageBucket: "healthmate-sign-login.firebasestorage.app",
  messagingSenderId: "478426428732",
  appId: "1:478426428732:web:637e025e9eaec2cdfc5a39"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const provider = new GoogleAuthProvider();

const signUpBtn = document.getElementById('signUpButton');
const signInSubmit = document.getElementById('signInSubmit');


// Get references to your HTML elements (assuming these IDs exist in your HTML)
const cgoogle = document.getElementById('cgoogle');
const lgoogle = document.getElementById('lgoogle');
const cguestButton = document.getElementById("cguestButton");
const lguestButton = document.getElementById("lguestButton");


// Register with Google
if (cgoogle) {
    cgoogle.addEventListener('click', (e) => {
        signInWithPopup(auth, provider)
            .then((result) => {
                const user = result.user;

                fetch(`https://healthmatepersonalhealthtrackerandappoin.onrender.com/user/getbyuid/${user.uid}`)
                    .then(response => {
                        if (response.ok) {
                            return response.json();
                        } else {
                            throw new Error("User not found in backend, initiating signup.");
                        }
                    })
                    .then(data => {
                        // User exists - treat it like login
                        localStorage.setItem("userId", data.id); // Store general user ID
                        localStorage.setItem("role", data.role);
                        if (data.role === "PATIENT") {
                            localStorage.setItem("patientId", data.id); // Store as patientId
                            localStorage.removeItem("doctorId"); // Ensure doctorId is not present
                        } else if (data.role === "DOCTOR") {
                            localStorage.setItem("doctorId", data.id); // Store as doctorId
                            localStorage.removeItem("patientId"); // Ensure patientId is not present
                        }

                        localStorage.setItem('isLoggedIn', 'true');
                        localStorage.setItem('name', user.displayName);
                        localStorage.setItem('email', user.email);
                        localStorage.setItem('firebaseUid', user.uid);

                        if (data.role === "PATIENT") {
                            window.location.href = "patient_dashboard.html";
                        } else {
                            window.location.href = "doctor_dashboard.html";
                        }
                    })
                    .catch((error) => {
                        console.warn("User not found in backend or other fetch error for Google Sign-up:", error.message);

                        let role = prompt("Welcome! Please enter your role: PATIENT");

                        if (!role) {
                            alert("Role is required for registration.");
                            return;
                        }

                        role = role.trim().toUpperCase();

                        if (role !== "PATIENT") {
                            alert("Invalid role. Please enter 'PATIENT'");
                            return;
                        }

                        // Register to backend
                        fetch('https://healthmatepersonalhealthtrackerandappoin.onrender.com/user/save', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                                name: user.displayName,
                                email: user.email,
                                firebaseUid: user.uid,
                                role: role
                            })
                        })
                            .then(response => {
                                if (!response.ok) throw new Error("Failed to save user in backend.");
                                return response.json();
                            })
                            .then(data => {
                                localStorage.setItem("userId", data.id); // Store general user ID
                                localStorage.setItem("role", data.role);
                                if (data.role === "PATIENT") {
                                    localStorage.setItem("patientId", data.id); // Store as patientId
                                    localStorage.removeItem("doctorId");
                                } else if (data.role === "DOCTOR") {
                                    localStorage.setItem("doctorId", data.id); // Store as doctorId
                                    localStorage.removeItem("patientId");
                                }

                                localStorage.setItem('isLoggedIn', 'true');
                                localStorage.setItem('name', user.displayName);
                                localStorage.setItem('email', user.email);
                                localStorage.setItem('firebaseUid', user.uid);

                                if (data.role === "PATIENT") {
                                    window.location.href = "patient_dashboard.html";
                                } else {
                                    window.location.href = "doctor_dashboard.html";
                                }
                            })
                            .catch((err) => {
                                console.error("Google Sign-in Registration error:", err);
                                alert("Failed to register and save user. Please try again.");
                            });
                    });
            })
            .catch((error) => {
                console.error("Google Sign-in overall error:", error);
                alert("Google Sign-in failed. Please try again.");
            });
    });
}


// Login With Google
if (lgoogle) {
    lgoogle.addEventListener('click', (e) => {
        signInWithPopup(auth, provider)
            .then((result) => {
                const user = result.user;

                fetch(`https://healthmatepersonalhealthtrackerandappoin.onrender.com/user/getbyuid/${user.uid}`)
                    .then(response => {
                        if (!response.ok) {
                            throw new Error("User not found in database. Please sign up.");
                        }
                        return response.json();
                    })
                    .then(data => {
                        localStorage.setItem("userId", data.id); // Store general user ID
                        localStorage.setItem("role", data.role);
                        if (data.role === "PATIENT") {
                            localStorage.setItem("patientId", data.id); // Store as patientId
                            localStorage.removeItem("doctorId");
                        } else if (data.role === "DOCTOR") {
                            localStorage.setItem("doctorId", data.id); // Store as doctorId
                            localStorage.removeItem("patientId");
                        }

                        localStorage.setItem('isLoggedIn', 'true');
                        localStorage.setItem('name', user.displayName);
                        localStorage.setItem('email', user.email);
                        localStorage.setItem('firebaseUid', user.uid);


                        if (data.role === "PATIENT") {
                            window.location.href = "patient_dashboard.html";
                        } else {
                            window.location.href = "doctor_dashboard.html";
                        }
                    })
                    .catch((error) => {
                        console.error("Error fetching user role for Google login:", error);
                        alert("Login failed. User not found. Please sign up first.");
                    });
            })
            .catch((error) => {
                console.error("Google Sign-in Error:", error);
                alert("Login failed. Please try again.");
            });
    });
}


// Register with Anonymous
if (cguestButton) {
    cguestButton.addEventListener("click", async (e) => {
        e.preventDefault();
        const emailInput = document.getElementById("mail").value;

        if (!emailInput) {
            alert("Please enter an email for guest registration.");
            return;
        }

        let role = prompt("Please enter your role: PATIENT");

        if (!role) {
            alert("Role is required for guest registration.");
            return;
        }

        role = role.trim().toUpperCase();

        if (role !== "PATIENT") {
            alert("Invalid role. Please enter 'PATIENT'");
            return;
        }

        try {
            const result = await signInAnonymously(auth);
            const user = result.user;

            await setDoc(doc(db, "users", user.uid), {
                email: emailInput,
                role: role,
                createdAt: new Date()
            });

            const response = await fetch('https://healthmatepersonalhealthtrackerandappoin.onrender.com/user/save', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: "Guest",
                    email: emailInput,
                    firebaseUid: user.uid,
                    role: role
                })
            });

            if (!response.ok) throw new Error("Failed to save guest user in backend.");

            const data = await response.json();

            localStorage.setItem("userId", data.id); // Store general user ID
            localStorage.setItem("role", data.role);
            if (data.role === "PATIENT") {
                localStorage.setItem("patientId", data.id); // Store as patientId
                localStorage.removeItem("doctorId");
            } else if (data.role === "DOCTOR") {
                localStorage.setItem("doctorId", data.id); // Store as doctorId
                localStorage.removeItem("patientId");
            }

            localStorage.setItem("isLoggedIn", "true");
            localStorage.setItem("name", "Guest");
            localStorage.setItem("email", emailInput);
            localStorage.setItem("firebaseUid", user.uid);

            if (data.role === "PATIENT") {
                window.location.href = "patient_dashboard.html";
            } else {
                window.location.href = "doctor_dashboard.html";
            }

        } catch (error) {
            console.error("Anonymous Sign-in Registration Error:", error);
            alert("Failed to register as guest. " + error.message);
        }
    });
}


// Login with Anonymous
if (lguestButton) {
    lguestButton.addEventListener("click", async (e) => {
        e.preventDefault();
        localStorage.clear(); 
        const emailInput = document.getElementById("email_Login").value;

        if (!emailInput) {
            alert("Please enter an email for guest login.");
            return;
        }

        try {
            const result = await signInAnonymously(auth);
            const user = result.user;

            const response = await fetch(`https://healthmatepersonalhealthtrackerandappoin.onrender.com/user/getbyuid/${user.uid}`);

            if (!response.ok) {
                throw new Error("Guest user not found in backend with current session. Please register as guest first.");
            }

            const data = await response.json();

            localStorage.setItem("userId", data.id); // Store general user ID
            localStorage.setItem("role", data.role);
            if (data.role === "PATIENT") {
                localStorage.setItem("patientId", data.id); // Store as patientId
                localStorage.removeItem("doctorId");
            } else if (data.role === "DOCTOR") {
                localStorage.setItem("doctorId", data.id); // Store as doctorId
                localStorage.removeItem("patientId");
            }

            localStorage.setItem("isLoggedIn", "true");
            localStorage.setItem("name", "Guest");
            localStorage.setItem("email", data.email);
            localStorage.setItem("firebaseUid", user.uid);

            if (data.role === "PATIENT") {
                window.location.href = "patient_dashboard.html";
            } else {
                window.location.href = "doctor_dashboard.html";
            }

        } catch (error) {
            console.error("Guest login failed:", error);
            alert("Login failed. " + error.message);
        }
    });
}


// ✅ Validation Helpers
function isValidName(name) {
  return /^[a-zA-Z\s]{2,}$/.test(name);
}
function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}
function isValidPassword(password) {
  return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/.test(password);
}

// ✅ SIGNUP Handler
if (signUpBtn) {
  signUpBtn.addEventListener('click', async (e) => {
    e.preventDefault();
    localStorage.clear();

    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('mail').value.trim();
    const password = document.getElementById('pass').value.trim();
    const role = document.getElementById('role').value;

    if (!name || !email || !password || role === 'Select') {
      return;
    }
    if (!isValidName(name)) {
      return;
    }
    if (!isValidEmail(email)) {
      return;
    }
    if (!isValidPassword(password)) {
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // ⬅️ Role-based backend API
      const endpoint = (role.toUpperCase() === "DOCTOR")
        ? "https://healthmatepersonalhealthtrackerandappoin.onrender.com/api/doctors/save"
        : "https://healthmatepersonalhealthtrackerandappoin.onrender.com/user/save";

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firebaseUid: user.uid,
          name: name,
          email: email,
          role: role.toUpperCase()
        })
      });

      if (!response.ok) throw new Error("Failed to save user in backend");

      const userData = await response.json();

      localStorage.setItem('userId', userData.id);
      localStorage.setItem('role', userData.role);
      localStorage.setItem('email', userData.email);
      localStorage.setItem('name', userData.name);
      localStorage.setItem('firebaseUid', user.uid);
      localStorage.setItem('isLoggedIn', 'true');

      if (userData.role === "PATIENT") {
        localStorage.setItem("patientId", userData.id);
        localStorage.removeItem("doctorId");
      } else {
        localStorage.setItem("doctorId", userData.id);
        localStorage.removeItem("patientId");
      }

      const formHeading = document.getElementById('formHeading');
      if (formHeading) formHeading.textContent = "LOGIN";
      document.getElementById('signUp').style.display = 'none';
      document.getElementById('signIn').style.display = 'flex';

    } catch (error) {
      let msg = "Signup failed. ";
      if (error.code === 'auth/email-already-in-use') {
        msg += "Email already registered.";
      } else if (error.message.includes("Failed to save user in backend")) {
        msg += "Server error saving user. Please try again.";
      } else {
        msg += error.message;
      }
      alert(msg);
      console.error("Signup Error:", error);
    }
  });
}

// ✅ LOGIN Handler
if (signInSubmit) {
  signInSubmit.addEventListener('click', async (e) => {
    e.preventDefault();

    const email = document.getElementById('email_Login').value.trim();
    const password = document.getElementById('password_Login').value.trim();

    if (!email || !password) {
      return;
    }

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      const firebaseUid = user.uid;

      // ⬅️ First: Try Doctor table
      const doctorResponse = await fetch(`https://healthmatepersonalhealthtrackerandappoin.onrender.com/api/doctors/getbyuid/${firebaseUid}`);
      if (doctorResponse.ok) {
        const doctor = await doctorResponse.json();

        localStorage.setItem("userId", doctor.id);
        localStorage.setItem("doctorId", doctor.id);
        localStorage.setItem("role", "DOCTOR");
        localStorage.setItem("name", doctor.name);
        localStorage.setItem("email", doctor.email);
        localStorage.setItem("firebaseUid", firebaseUid);
        localStorage.setItem("isLoggedIn", "true");
        

        window.location.href = "doctor_dashboard.html";
        return;
      }

      // ⬅️ Else: Try Patient table
      const patientResponse = await fetch(`https://healthmatepersonalhealthtrackerandappoin.onrender.com/user/getbyuid/${firebaseUid}`);
      if (patientResponse.ok) {
        const patient = await patientResponse.json();

        localStorage.setItem("userId", patient.id);
        localStorage.setItem("patientId", patient.id);
        localStorage.setItem("role", "PATIENT");
        localStorage.setItem("name", patient.name);
        localStorage.setItem("email", patient.email);
        localStorage.setItem("firebaseUid", firebaseUid);
        localStorage.setItem("isLoggedIn", "true");

        window.location.href = "patient_dashboard.html";
      } else {
        alert("User not found in system. Please sign up.");
      }

    } catch (error) {
      let msg = "Login failed. ";
      if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
        msg = "Invalid email or password.";
      } else if (error.code === 'auth/invalid-email') {
        msg += "Invalid email format.";
      } else {
        msg += error.message;
      }
      console.error("Login Error:", error);
    }
  });
}
