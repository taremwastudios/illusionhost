document.addEventListener("DOMContentLoaded", async () => {
  const supabaseUrl = "https://cwhimjygbagubhtdoobk.supabase.co";
  const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN3aGltanlnYmFndWJodGRvb2JrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUyMjYzODMsImV4cCI6MjA5MDgwMjM4M30.6bQGU2hvWZT9L5tMNr4RMyoLsrY_izeUBHbcS1GF-a4";
  const supabase = window.supabase.createClient(supabaseUrl, supabaseKey);

  const preorderBtn = document.getElementById("preorder-btn");
  const subdomainInput = document.getElementById("subdomain");
  const counterText = document.getElementById("counter");

  // Load preorder count (optional)
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

  preorderBtn.addEventListener("click", async () => {
    const subdomain = subdomainInput.value.trim();
    if (!subdomain) return alert("Enter a subdomain");

    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return alert("You must be logged in to preorder");

    const orderId = generateOrderId();

    try {
      // Save order in Supabase
      const { error } = await supabase.from("orders").insert([{
        email: session.user.email,
        subdomain,
        order_id: orderId,
        status: "pending"
      }]);

      if (error) throw error;

      // Send email via Formspree
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

      alert(`Preorder placed! Check your email. Order ID: ${orderId}`);
      subdomainInput.value = "";
      await loadCounter();
    } catch (err) {
      console.error(err);
      alert("Failed to place preorder. Try again.");
    }
  });
});