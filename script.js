document.addEventListener("DOMContentLoaded", () => {

  console.log("JS LOADED");

  // ==========================
  // SUPABASE INIT
  // ==========================
  const supabaseUrl = "https://cwhimjygbagubhtdoobk.supabase.co";
  const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN3aGltanlnYmFndWJodGRvb2JrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUyMjYzODMsImV4cCI6MjA5MDgwMjM4M30.6bQGU2hvWZT9L5tMNr4RMyoLsrY_izeUBHbcS1GF-a4"; // replace with your anon key
  const supabase = window.supabase.createClient(supabaseUrl, supabaseKey);

  // ==========================
  // ELEMENTS
  // ==========================
  const toggleBtn = document.getElementById("toggle-btn");
  const toggleMessage = document.getElementById("toggle-message");
  const loginForm = document.getElementById("login-form");
  const registerForm = document.getElementById("register-form");
  const formTitle = document.getElementById("form-title");

  let isLogin = true;

  // ==========================
  // TOGGLE LOGIN / REGISTER
  // ==========================
  toggleBtn.addEventListener("click", () => {
    isLogin = !isLogin;

    if (isLogin) {
      loginForm.style.display = "block";
      registerForm.style.display = "none";
      formTitle.innerText = "Login";
      toggleMessage.innerText = "Don't have an account?";
      toggleBtn.innerText = "Register";
    } else {
      loginForm.style.display = "none";
      registerForm.style.display = "block";
      formTitle.innerText = "Register";
      toggleMessage.innerText = "Already have an account?";
      toggleBtn.innerText = "Login";
    }
  });

  // ==========================
  // REGISTER FUNCTION (GLOBAL)
  // ==========================
  window.register = async function () {
    const email = document.querySelector("#register-form input[type='email']").value;
    const password = document.querySelector("#register-form input[type='password']").value;

    const { error } = await supabase.auth.signUp({ email, password });

    if (error) alert(error.message);
    else alert("Check your email to confirm your account!");
  };

  // ==========================
  // LOGIN FUNCTION (GLOBAL)
  // ==========================
  window.login = async function () {
    const email = document.querySelector("#login-form input[type='email']").value;
    const password = document.querySelector("#login-form input[type='password']").value;

    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) alert(error.message);
    else {
      alert("Logged in!");
      console.log(data.user);
    }
  };

  // ==========================
  // CHECK USER
  // ==========================
  async function checkUser() {
    const { data } = await supabase.auth.getUser();

    if (data.user) console.log("User logged in:", data.user.email);
    else console.log("No user logged in");
  }

  checkUser();

});