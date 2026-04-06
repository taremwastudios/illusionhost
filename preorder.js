document.addEventListener("DOMContentLoaded", async () => {
  const preorderBtn = document.getElementById("preorder-btn");
  const counterText = document.getElementById("counter");
  const subdomainInput = document.getElementById("subdomain");

  async function loadCounter() {
    const response = await fetch("/orders/count");
    const data = await response.json();
    counterText.innerText = `${data.count} people already preordered!`;
  }

  await loadCounter();

  function generateOrderId() {
    return `od-id-039${Math.random().toString(36).substring(2, 12).toUpperCase()}`;
  }

  preorderBtn.addEventListener("click", async () => {
    const subdomain = subdomainInput.value.trim();
    if (!subdomain) return alert("Enter a subdomain");

    // Replace with actual auth user
    const user = { email: "test@example.com" };

    const orderId = generateOrderId();

    try {
      const result = await fetch("/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: user.email, subdomain, order_id: orderId })
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