document.addEventListener("DOMContentLoaded", async () => {

  console.log("JS LOADED");

  // ==========================
  // SUPABASE INIT
  // ==========================
  const supabaseUrl = "https://cwhimjygbagubhtdoobk.supabase.co";
  const supabaseKey = "YOUR_ANON_KEY_HERE"; // replace with your anon key
  const supabase = window.supabase.createClient(supabaseUrl, supabaseKey);

  // ==========================
  // CHECK IF USER CLICKED CONFIRM LINK
  // ==========================
  const hash = window.location.hash;
  if (hash.includes("access_token")) {
    const params = new URLSearchParams(hash.slice(1)); // remove #
    const access_token = params.get("access_token");
    const refresh_token = params.get("refresh_token");

    // set session
    const { data, error } = await supabase.auth.setSession({
      access_token,
      refresh_token
    });

    if (error) {
      console.error("Error setting session:", error);
    } else {
      alert("Email confirmed! You are logged in.");
      console.log("User:", data.user);
      // Redirect to preorder page
      window.location.href = "/preorder.html";
    }
  }

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

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: "https://gleaming-penelopa-taremwastudios-4ee6b400.koyeb.app"
      }
    });

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
      console.log("User:", data.user);
      // Redirect to preorder page
      window.location.href = "/preorder.html";
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