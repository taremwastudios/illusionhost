document.addEventListener("DOMContentLoaded", async () => {

  const preorderBtn = document.getElementById("preorder-btn");
  const counterText = document.getElementById("counter");
  const subdomainInput = document.getElementById("subdomain");

  // Load counter (you can still use Supabase if you want)
  async function loadCounter() {
    // Replace with fetch to your server if needed
    const response = await fetch('/orders/count'); // optional
    const data = await response.json();
    counterText.innerText = `${data.count} people already preordered!`;
  }

  await loadCounter();

  function generateOrderId() {
    const random = Math.random().toString(36).substring(2, 12).toUpperCase();
    return `od-id-039${random}`;
  }

  preorderBtn.addEventListener("click", async () => {
    const subdomain = subdomainInput.value.trim();
    if (!subdomain) return alert("Enter a subdomain");

    // Example: logged-in user info
    const user = { email: "test@example.com", id: "123" }; // replace with your auth system

    const orderId = generateOrderId();

    try {
      const result = await fetch('/send-email', {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: user.email,
          subdomain: subdomain,
          order_id: orderId
        })
      });

      const data = await result.json();
      if (!data.success) throw new Error(data.error);

      alert("Preorder placed! Check your email.");
      subdomainInput.value = "";
      await loadCounter();
    } catch (err) {
      console.error("Email failed:", err);
      alert("Failed to send email. Try again later.");
    }
  });
});