document.addEventListener("DOMContentLoaded", async () => {

  console.log("JS LOADED");

  // ==========================
  // SUPABASE INIT
  // ==========================
  const supabaseUrl = "https://cwhimjygbagubhtdoobk.supabase.co";
  const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN3aGltanlnYmFndWJodGRvb2JrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUyMjYzODMsImV4cCI6MjA5MDgwMjM4M30.6bQGU2hvWZT9L5tMNr4RMyoLsrY_izeUBHbcS1GF-a4"; // replace with your anon key
  const supabase = window.supabase.createClient(supabaseUrl, supabaseKey);
  let isRouting = false;

  async function getLatestOrder(email) {
    const { data, error } = await supabase
      .from("orders")
      .select("order_id, status, created_at")
      .eq("email", email)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) {
      console.error("Failed to check existing order:", error);
      return null;
    }

    return data;
  }

  async function routeAuthenticatedUser(user) {
    if (!user || isRouting) return;
    isRouting = true;

    const existingOrder = await getLatestOrder(user.email);
    if (existingOrder) {
      window.location.href = "/track.html";
      return;
    }

    window.location.href = "/preorder.html";
  }

  async function getCurrentUser() {
    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (!userError && userData.user) return userData.user;

    const { data: sessionData } = await supabase.auth.getSession();
    return sessionData.session?.user || null;
  }

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
      const sessionUser = data.session?.user || data.user;
      alert("Email confirmed! You are logged in.");
      console.log("User:", sessionUser);
      await routeAuthenticatedUser(sessionUser);
      return;
    }
  }

  const currentUser = await getCurrentUser();
  if (currentUser) {
    await routeAuthenticatedUser(currentUser);
    return;
  }

  supabase.auth.onAuthStateChange(async (_event, session) => {
    if (session?.user) {
      await routeAuthenticatedUser(session.user);
    }
  });

  // ==========================
  // ELEMENTS
  // ==========================
  const toggleBtn = document.getElementById("toggle-btn");
  const toggleMessage = document.getElementById("toggle-message");
  const loginForm = document.getElementById("login-form");
  const registerForm = document.getElementById("register-form");
  const formTitle = document.getElementById("form-title");
  const loginBtn = document.getElementById("login-btn");
  const registerBtn = document.getElementById("register-btn");
  const authStatus = document.getElementById("auth-status");

  let isLogin = true;

  function setLoading(button, isLoading) {
    button.disabled = isLoading;
    button.classList.toggle("loading", isLoading);
  }

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
  async function register() {
    const email = document.querySelector("#register-form input[type='email']").value;
    const password = document.querySelector("#register-form input[type='password']").value;

    if (!email || !password) {
      authStatus.innerText = "Please enter both email and password.";
      return;
    }

    setLoading(registerBtn, true);
    authStatus.innerText = "Creating your account...";

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: "https://gleaming-penelopa-taremwastudios-4ee6b400.koyeb.app"
        }
      });

      if (error) {
        authStatus.innerText = error.message;
      } else {
        authStatus.innerText = "Account created. Email sent successfully — you will receive a confirmation soon.";
      }
    } finally {
      setLoading(registerBtn, false);
    }
  }

  // ==========================
  // LOGIN FUNCTION (GLOBAL)
  // ==========================
  async function login() {
    const email = document.querySelector("#login-form input[type='email']").value;
    const password = document.querySelector("#login-form input[type='password']").value;

    if (!email || !password) {
      authStatus.innerText = "Please enter both email and password.";
      return;
    }

    setLoading(loginBtn, true);
    authStatus.innerText = "Logging you in...";

    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });

      if (error) {
        authStatus.innerText = error.message;
      } else {
        authStatus.innerText = "Login successful. Redirecting...";
        console.log("User:", data.user);
        await routeAuthenticatedUser(data.user);
      }
    } finally {
      setLoading(loginBtn, false);
    }
  }

  loginBtn.addEventListener("click", login);
  registerBtn.addEventListener("click", register);

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