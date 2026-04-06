// email-test.js
document.addEventListener("DOMContentLoaded", async () => {
  const preorderBtn = document.getElementById("preorder-btn");
  const subdomainInput = document.getElementById("subdomain");

  const { data: { session } } = await supabase.auth.getSession();
  if (!session) return alert("You must be logged in");

  const user = session.user;

  preorderBtn.addEventListener("click", async () => {
    const subdomain = subdomainInput.value.trim();
    if (!subdomain) return alert("Enter a subdomain");

    const orderId = `OD-${Math.random().toString(36).substring(2, 12).toUpperCase()}`;

    try {
      const response = await fetch("https://formspree.io/f/mqegwgol", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: user.email,
          subdomain: subdomain,
          order_id: orderId,
          message: `Your preorder was successful! Order ID: ${orderId}`
        })
      });

      if (response.ok) {
        alert(`Email sent successfully! Your Order ID: ${orderId}`);
      } else {
        const text = await response.text();
        console.error("Formspree error:", text);
        alert("Failed to send email. Check console.");
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong sending the email.");
    }
  });
});