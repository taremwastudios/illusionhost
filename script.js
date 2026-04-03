const images = [
  "campus.png",
  "icons.png",
  "illusion.png"
];

let index = 0;

const slider = document.getElementById("slider");

setInterval(() => {
  index = (index + 1) % images.length;
  slider.src = images[index];
}, 3000); // change every 3 seconds

const toggleBtn = document.getElementById("toggle-btn");
const loginForm = document.getElementById("login-form");
const registerForm = document.getElementById("register-form");
const formTitle = document.getElementById("form-title");
const toggleText = document.getElementById("toggle-text");

let isLogin = true;

toggleBtn.addEventListener("click", () => {
  isLogin = !isLogin;

  if (isLogin) {
    loginForm.style.display = "block";
    registerForm.style.display = "none";
    formTitle.innerText = "Login";
    toggleText.innerHTML = `Don't have an account? <span id="toggle-btn">Register</span>`;
  } else {
    loginForm.style.display = "none";
    registerForm.style.display = "block";
    formTitle.innerText = "Register";
    toggleText.innerHTML = `Already have an account? <span id="toggle-btn">Login</span>`;
  }

  // re-bind click after innerHTML change
  document.getElementById("toggle-btn").addEventListener("click", arguments.callee);
});

const supabaseUrl = "https://cwhimjygbagubhtdoobk.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN3aGltanlnYmFndWJodGRvb2JrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUyMjYzODMsImV4cCI6MjA5MDgwMjM4M30.6bQGU2hvWZT9L5tMNr4RMyoLsrY_izeUBHbcS1GF-a4";

const supabase = window.supabase.createClient(supabaseUrl, supabaseKey);

async function register() {
  const email = document.querySelector("#register-form input[type='email']").value;
  const password = document.querySelector("#register-form input[type='password']").value;

  const { data, error } = await supabase.auth.signUp({
    email: email,
    password: password
  });

  if (error) {
    alert(error.message);
  } else {
    alert("Check your email to confirm your account!");
  }
}

async function login() {
  const email = document.querySelector("#login-form input[type='email']").value;
  const password = document.querySelector("#login-form input[type='password']").value;

  const { data, error } = await supabase.auth.signInWithPassword({
    email: email,
    password: password
  });

  if (error) {
    alert(error.message);
  } else {
    alert("Logged in!");
    console.log(data.user);
  }
}

async function checkUser() {
  const { data } = await supabase.auth.getUser();

  if (data.user) {
    console.log("User is logged in:", data.user.email);
  } else {
    console.log("No user logged in");
  }
}

checkUser();