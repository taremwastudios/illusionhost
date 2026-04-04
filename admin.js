document.addEventListener("DOMContentLoaded", async () => {

  const supabaseUrl = "https://cwhimjygbagubhtdoobk.supabase.co";
  const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN3aGltanlnYmFndWJodGRvb2JrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUyMjYzODMsImV4cCI6MjA5MDgwMjM4M30.6bQGU2hvWZT9L5tMNr4RMyoLsrY_izeUBHbcS1GF-a4";
  const supabase = window.supabase.createClient(supabaseUrl, supabaseKey);

  const table = document.getElementById("orders-table");

  // ==========================
  // LOAD ORDERS
  // ==========================
  async function loadOrders() {

    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error(error);
      return;
    }

    table.innerHTML = "";

    data.forEach(order => {

      const row = document.createElement("tr");

      row.innerHTML = `
        <td>${order.email}</td>
        <td>${order.subdomain}</td>
        <td>${order.order_id}</td>
        <td>${order.status}</td>
        <td>
          <button class="confirm" onclick="confirmOrder('${order.id}')">Confirm</button>
          <button class="live" onclick="markLive('${order.id}')">Live</button>
        </td>
      `;

      table.appendChild(row);
    });

  }

  await loadOrders();

  // ==========================
  // CONFIRM ORDER
  // ==========================
  window.confirmOrder = async function (id) {

    const { error } = await supabase
      .from("orders")
      .update({ status: "confirmed" })
      .eq("id", id);

    if (error) {
      alert(error.message);
    } else {
      alert("Order confirmed");
      loadOrders();
    }
  };

  // ==========================
  // MARK AS LIVE
  // ==========================
  window.markLive = async function (id) {

    const { error } = await supabase
      .from("orders")
      .update({ status: "live" })
      .eq("id", id);

    if (error) {
      alert(error.message);
    } else {
      alert("Marked as live 🚀");
      loadOrders();
    }
  };

});