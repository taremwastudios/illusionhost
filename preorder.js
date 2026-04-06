document.addEventListener("DOMContentLoaded", async () => {
  const form = document.getElementById("preorder-form");
  const emailInput = document.getElementById("email");
  const orderInput = document.getElementById("order_id");
  const subdomainInput = document.getElementById("subdomain");
  const counterText = document.getElementById("counter");

  // Mock logged-in user (replace with your auth system)
  const user = { email: "taremwastudios@gmail.com", id: "123" };

  // Set email automatically
  emailInput.value = user.email;

  // Optional: load preorder count
  let preorderCount = 0;
  function loadCounter() {
    counterText.innerText = `${preorderCount} people already preordered!`;
  }
  loadCounter();

  function generateOrderId() {
    const random = Math.random().toString(36).substring(2, 12).toUpperCase();
    return `od-id-039${random}`;
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault(); // prevent normal reload

    const subdomain = subdomainInput.value.trim();
    if (!subdomain) return alert("Enter a subdomain");

    // Generate order ID
    const orderId = generateOrderId();
    orderInput.value = orderId;

    // Increment local counter
    preorderCount++;
    loadCounter();

    // Submit to Formspree
    fetch(form.action, {
      method: form.method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: user.email,
        subdomain,
        order_id: orderId
      })
    })
    .then(res => res.ok ? alert(`Preorder placed! Order ID: ${orderId}`) : alert("Failed to send preorder."))
    .catch(err => {
      console.error(err);
      alert("Failed to send preorder. Try again.");
    });

    // Clear subdomain input
    subdomainInput.value = "";
  });
});