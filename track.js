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

  function renderStatus(status) {
    if (status === "pending") {
      result.innerText = "🟡 Awaiting admin confirmation";
      return;
    }

    if (status === "confirmed") {
      result.innerText = "🔵 Confirmed! Preparing deployment";
      return;
    }

    if (status === "live") {
      result.innerText = "🟢 Your subdomain is live";
      return;
    }

    result.innerText = "Status unavailable";
  }

  let userEmail = null;

  async function guardAndLoadLatestOrder() {
    const { data: sessionData } = await supabase.auth.getSession();
    const session = sessionData.session;

    if (!session) {
      window.location.href = "/index.html";
      return false;
    }

    userEmail = session.user.email;

    const { data: latestOrder, error } = await supabase
      .from("orders")
      .select("order_id, status, created_at")
      .eq("email", userEmail)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) {
      console.error(error);
      result.innerText = "Failed to load your latest order";
      return false;
    }

    if (!latestOrder) {
      window.location.href = "/preorder.html";
      return false;
    }

    orderInput.value = latestOrder.order_id;
    renderStatus(latestOrder.status);
    return true;
  }

  guardAndLoadLatestOrder();

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
      .eq("email", userEmail)
      .single();

    if (error || !data) {
      result.innerText = "❌ Invalid order ID";
      return;
    }

    renderStatus(data.status);

  });

});