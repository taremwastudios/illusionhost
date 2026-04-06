document.addEventListener("DOMContentLoaded", async () => {
  const supabaseUrl = "https://cwhimjygbagubhtdoobk.supabase.co";
  const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN3aGltanlnYmFndWJodGRvb2JrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUyMjYzODMsImV4cCI6MjA5MDgwMjM4M30.6bQGU2hvWZT9L5tMNr4RMyoLsrY_izeUBHbcS1GF-a4";
  const supabase = window.supabase.createClient(supabaseUrl, supabaseKey);

  const preorderForm = document.getElementById("preorder-form");
  const preorderBtn = document.getElementById("preorder-btn");
  const subdomainInput = document.getElementById("subdomain");
  const counterText = document.getElementById("counter");

  const { data: sessionData } = await supabase.auth.getSession();
  const session = sessionData.session;

  if (!session) {
    window.location.href = "/index.html";
    return;
  }

  async function getExistingOrder(email) {
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

  const existingOrder = await getExistingOrder(session.user.email);
  if (existingOrder) {
    window.location.href = "/track.html";
    return;
  }

  async function loadCounter() {
    const { data, error } = await supabase
      .from("orders")
      .select("*", { count: "exact" });

    if (error) {
      console.error(error);
      counterText.innerText = "0 people already preordered!";
      return;
    }

    counterText.innerText = `${data.length} people already preordered!`;
  }

  await loadCounter();

  function generateOrderId() {
    return `OD-${Math.random().toString(36).substring(2, 12).toUpperCase()}`;
  }

  async function handlePreorder() {
    const subdomain = subdomainInput.value.trim();
    if (!subdomain) return alert("Enter a subdomain");

    const orderId = generateOrderId();
    preorderBtn.disabled = true;

    try {
      const { error } = await supabase.from("orders").insert([{
        email: session.user.email,
        subdomain,
        order_id: orderId,
        status: "pending"
      }]);

      if (error) throw error;

      const res = await fetch("https://formspree.io/f/mqegwgol", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: session.user.email,
          subdomain,
          order_id: orderId,
          message: `Your preorder was successful! Order ID: ${orderId}`
        })
      });

      if (!res.ok) throw new Error("Email failed");

      alert(`Preorder submitted successfully. You will receive a confirmation soon. Order ID: ${orderId}`);
      subdomainInput.value = "";
      window.location.href = "/track.html";
    } catch (err) {
      console.error("Preorder failed:", err);
      alert(`Failed to place preorder: ${err.message || "Unknown error"}`);
    } finally {
      preorderBtn.disabled = false;
    }
  }

  preorderBtn.addEventListener("click", handlePreorder);
  preorderForm.addEventListener("submit", (event) => event.preventDefault());
});