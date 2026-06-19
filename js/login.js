
const signUpButton = document.getElementById('signUpSwitch');
const signInButton = document.getElementById('signInButton');
const signInForm = document.getElementById('signIn');
const signUpForm = document.getElementById('signUp');
const formHeading = document.getElementById('formHeading');


// Switch to Login form
signInButton.addEventListener('click', function (e) {
  e.preventDefault();
  signUpForm.style.display = "none";
  signInForm.style.display = "flex";
  formHeading.textContent = "LOGIN";
});

// Switch to Sign-Up form
signUpButton.addEventListener('click', function (e) {
  e.preventDefault();
  signInForm.style.display = "none";
  signUpForm.style.display = "flex";
  formHeading.textContent = "CREATE ACCOUNT";
});


let registeredEmail = '';
let registeredPassword = '';

function isValidName(name) {
  const namePattern = /^[a-zA-Z\s'-]{2,50}$/;
  return namePattern.test(name);
}

function isValidEmail(email) {
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailPattern.test(email);
}

function isValidPassword(password) {
  const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
  return passwordPattern.test(password);
}

document.getElementById('signUpButton').addEventListener('click', function () {
  const name = document.getElementById('name').value.trim()
  const email = document.getElementById('mail').value.trim();
  const password = document.getElementById('pass').value.trim();
  const role = document.getElementById('role').value;

  if (name === '' || email === '' || password === '' || role === 'Select') {
    alert('Please fill in all the details.');
  }
  else if (!isValidName(name)) {
    alert('Please enter a valid name.');
  }else if (!isValidEmail(email)) {
    alert('Please enter a valid email address.');
  } else if (!isValidPassword(password)) {
    alert('Password must be at least 8 characters long and include an uppercase letter, lowercase letter, and a number.');
  } else {
    // Save registration credentials
    registeredEmail = email;
    registeredPassword = password;

    alert('Registration successful! Please log in.');

    // Switch to login form
    document.getElementById('signUp').style.display = 'none';
    document.getElementById('signIn').style.display = 'flex';
  }
});// Switch to Sign Up form
document.getElementById('signUpSwitch').addEventListener('click', function () {
  document.getElementById('signIn').style.display = 'none';
  document.getElementById('signUp').style.display = 'flex';
});

// ✅ Validation functions
function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}
function isValidPassword(password) {
  return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/.test(password);
}

// ✅ Login logic using Firebase
document.getElementById('signInSubmit').addEventListener('click', async function (e) {
  e.preventDefault();

  const loginEmail = document.getElementById('email_Login').value.trim();
  const loginPass = document.getElementById('password_Login').value.trim();

  if (loginEmail === '' || loginPass === '') {
    alert('Please enter login credentials.');
    return;
  }

  if (!isValidEmail(loginEmail)) {
    alert('Please enter a valid login email.');
    return;
  }

  if (!isValidPassword(loginPass)) {
    alert('Invalid password format. Must be at least 8 characters, with an uppercase, lowercase, and a number.');
    return;
  }

  // ✅ Sign in with Firebase
  try {
    const userCredential = await signInWithEmailAndPassword(auth, loginEmail, loginPass);
    const user = userCredential.user;

    // Optional: Store to localStorage or fetch role from your backend
    localStorage.setItem('firebaseUid', user.uid);
    localStorage.setItem('email', user.email);
    localStorage.setItem('isLoggedIn', 'true');

    // Redirect based on role (Doctor or Patient logic)
    window.location.href = 'patient_dashboard.html';

  } catch (error) {
    alert('Login Successfull Redired to Dashboard: ');
    console.error(error);
  }
});



