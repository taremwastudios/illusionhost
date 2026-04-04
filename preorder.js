document.addEventListener("DOMContentLoaded", async () => {

  const supabaseUrl = "https://cwhimjygbagubhtdoobk.supabase.co";
  const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN3aGltanlnYmFndWJodGRvb2JrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUyMjYzODMsImV4cCI6MjA5MDgwMjM4M30.6bQGU2hvWZT9L5tMNr4RMyoLsrY_izeUBHbcS1GF-a4";
  const supabase = window.supabase.createClient(supabaseUrl, supabaseKey);

  const preorderBtn = document.getElementById("preorder-btn");
  const counterText = document.getElementById("counter");
  const subdomainInput = document.getElementById("subdomain");

  async function loadCounter() {
    const { count } = await supabase
      .from("orders")
      .select("*", { count: "exact", head: true });

    counterText.innerText = `${count} people already preordered!`;
  }

  await loadCounter();

  function generateOrderId() {
    const random = Math.random().toString(36).substring(2, 12).toUpperCase();
    return `od-id-039${random}`;
  }

  preorderBtn.addEventListener("click", async () => {

    const subdomain = subdomainInput.value.trim();

    if (!subdomain) {
      alert("Enter a subdomain");
      return;
    }

    const { data } = await supabase.auth.getUser();
    const user = data.user;

    if (!user) {
      alert("You must be logged in");
      return;
    }

    const { data: existing } = await supabase
      .from("orders")
      .select("*")
      .eq("user_id", user.id)
      .maybeSingle();

    if (existing) {
      alert("You already placed an order!");
      return;
    }

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

    // ✅ SUCCESS (NO EMAIL FOR NOW)
    alert("Preorder placed successfully!");

    subdomainInput.value = "";

    await loadCounter();

  });

});