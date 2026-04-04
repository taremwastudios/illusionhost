document.addEventListener("DOMContentLoaded", async () => {

  // ==========================
  // SUPABASE INIT
  // ==========================
  const supabaseUrl = "https://cwhimjygbagubhtdoobk.supabase.co";
  const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN3aGltanlnYmFndWJodGRvb2JrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUyMjYzODMsImV4cCI6MjA5MDgwMjM4M30.6bQGU2hvWZT9L5tMNr4RMyoLsrY_izeUBHbcS1GF-a4";
  const supabase = window.supabase.createClient(supabaseUrl, supabaseKey);

  const preorderBtn = document.getElementById("preorder-btn");
  const counterText = document.getElementById("counter");
  const subdomainInput = document.getElementById("subdomain");

  // ==========================
  // LOAD COUNTER
  // ==========================
  async function loadCounter() {
    const { count, error } = await supabase
      .from("orders")
      .select("*", { count: "exact", head: true });

    if (!error) {
      counterText.innerText = `${count} people already preordered!`;
    }
  }

  await loadCounter();

  // ==========================
  // GENERATE ORDER ID
  // ==========================
  function generateOrderId() {
    const random = Math.random().toString(36).substring(2, 12).toUpperCase();
    return `od-id-039${random}`;
  }

  // ==========================
  // PREORDER CLICK
  // ==========================
  preorderBtn.addEventListener("click", async () => {

    const subdomain = subdomainInput.value.trim();

    if (!subdomain) {
      alert("Enter a subdomain");
      return;
    }

    // Get logged in user
    const { data: userData } = await supabase.auth.getUser();
    const user = userData.user;

    if (!user) {
      alert("You must be logged in");
      return;
    }

    // ==========================
    // PREVENT DUPLICATE ORDER
    // ==========================
    const { data: existing } = await supabase
      .from("orders")
      .select("*")
      .eq("user_id", user.id)
      .maybeSingle();

    if (existing) {
      alert("You have already placed a preorder!");
      return;
    }

    // ==========================
    // INSERT ORDER
    // ==========================
    const orderId = generateOrderId();

    const { error } = await supabase.from("orders").insert({
      user_id: user.id,
      email: user.email,
      subdomain: subdomain,
      order_id: orderId,
      status: "pending"
    });

    if (error) {
      alert(error.message);
      return;
    }
  // send email to admin
await fetch("https://cwhimjygbagubhtdoobk.supabase.co/functions/v1/send-email", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    type: "admin",
    email: user.email,
    subdomain: subdomain,
    order_id: orderId
  })
});

    // ==========================
    // SUCCESS
    // ==========================
    alert("Preorder placed! Await admin confirmation.");

    subdomainInput.value = "";

    // Reload counter
    await loadCounter();

  });

});