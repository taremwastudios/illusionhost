document.addEventListener("DOMContentLoaded", () => {

  // ==========================
  // SUPABASE INIT
  // ==========================
  const supabaseUrl = "https://cwhimjygbagubhtdoobk.supabase.co";
  const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN3aGltanlnYmFndWJodGRvb2JrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUyMjYzODMsImV4cCI6MjA5MDgwMjM4M30.6bQGU2hvWZT9L5tMNr4RMyoLsrY_izeUBHbcS1GF-a4";
  const supabase = window.supabase.createClient(supabaseUrl, supabaseKey);

  const trackBtn = document.getElementById("track-btn");
  const orderInput = document.getElementById("order-id");
  const result = document.getElementById("status-result");

  // ==========================
  // TRACK BUTTON
  // ==========================
  trackBtn.addEventListener("click", async () => {

    const orderId = orderInput.value.trim();

    if (!orderId) {
      result.innerText = "Please enter your order ID";
      return;
    }

    // ==========================
    // FETCH ORDER
    // ==========================
    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .eq("order_id", orderId)
      .single();

    if (error || !data) {
      result.innerText = "❌ Invalid order ID";
      return;
    }

    // ==========================
    // SHOW STATUS
    // ==========================
    if (data.status === "pending") {
      result.innerText = "🟡 Awaiting admin confirmation";
    }

    if (data.status === "confirmed") {
      result.innerText = "🔵 Confirmed! Preparing deployment";
    }

    if (data.status === "live") {
      result.innerText = "🟢 Your subdomain is live 🚀";
    }

  });

});