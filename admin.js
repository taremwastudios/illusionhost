document.addEventListener("DOMContentLoaded", async () => {
  const ADMIN_EMAIL = "taremwastudios@gmail.com";
  const FORMSPREE_URL = "https://formspree.io/f/mqegwgol";

  const supabaseUrl = "https://cwhimjygbagubhtdoobk.supabase.co";
  const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN3aGltanlnYmFndWJodGRvb2JrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUyMjYzODMsImV4cCI6MjA5MDgwMjM4M30.6bQGU2hvWZT9L5tMNr4RMyoLsrY_izeUBHbcS1GF-a4"; // keep your existing anon key
  const supabase = window.supabase.createClient(supabaseUrl, supabaseKey);

  const table = document.getElementById("orders-table");
  const ordersCount = document.getElementById("orders-count");
  const statusText = document.getElementById("admin-status");
  const subtitle = document.getElementById("admin-subtitle");
  const refreshBtn = document.getElementById("refresh-btn");
  const logoutBtn = document.getElementById("logout-btn");

  let currentSession = null;

  function setStatus(msg) {
    statusText.innerText = msg;
  }

  function getStatusClass(status) {
    if (status === "confirmed") return "status-confirmed";
    if (status === "live") return "status-live";
    return "status-pending";
  }

  function makeCell(text) {
    const td = document.createElement("td");
    td.textContent = text ?? "";
    return td;
  }

  async function requireAdmin() {
    const { data: sessionData } = await supabase.auth.getSession();
    currentSession = sessionData.session;

    if (!currentSession?.user) {
      window.location.href = "/index.html";
      return false;
    }

    if (currentSession.user.email !== ADMIN_EMAIL) {
      alert("Unauthorized");
      window.location.href = "/index.html";
      return false;
    }

    subtitle.innerText = `Logged in as ${currentSession.user.email}`;
    return true;
  }

  async function sendStatusEmail(order, newStatus) {
    const subject =
      newStatus === "confirmed"
        ? "Your preorder is confirmed ✅"
        : "Your subdomain is now live 🚀";

    const message =
      newStatus === "confirmed"
        ? `Hi! Your preorder is confirmed.\nOrder ID: ${order.order_id}\nSubdomain: ${order.subdomain}\nYou can track progress anytime.`
        : `Great news! Your subdomain is now live.\nOrder ID: ${order.order_id}\nSubdomain: ${order.subdomain}\nYou have it free for 1 month 🎉`;

    const payload = {
      to: order.email,
      subject,
      message,
      order_id: order.order_id,
      subdomain: order.subdomain,
      status: newStatus
    };

    const res = await fetch(FORMSPREE_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    if (!res.ok) {
      throw new Error("Email send failed");
    }
  }

  async function updateOrderStatus(order, newStatus) {
    try {
      setStatus(`Updating ${order.order_id} to "${newStatus}"...`);

      const { error } = await supabase
        .from("orders")
        .update({ status: newStatus })
        .eq("id", order.id);

      if (error) throw error;

      await sendStatusEmail(order, newStatus);

      setStatus(`Updated ${order.order_id} to "${newStatus}" and email sent to ${order.email}.`);
      await loadOrders();
    } catch (err) {
      console.error(err);
      alert(err.message || "Failed updating order");
      setStatus(`Failed update: ${err.message || "unknown error"}`);
    }
  }

  function renderRows(data) {
    table.innerHTML = "";

    data.forEach((order) => {
      const row = document.createElement("tr");

      row.appendChild(makeCell(order.email));
      row.appendChild(makeCell(order.subdomain));
      row.appendChild(makeCell(order.order_id));

      const statusTd = document.createElement("td");
      const badge = document.createElement("span");
      badge.className = `status-badge ${getStatusClass(order.status)}`;
      badge.textContent = order.status || "pending";
      statusTd.appendChild(badge);
      row.appendChild(statusTd);

      const actionTd = document.createElement("td");
      const actionWrap = document.createElement("div");
      actionWrap.className = "row-actions";

      const confirmBtn = document.createElement("button");
      confirmBtn.className = "action-btn action-confirm";
      confirmBtn.textContent = "Confirm";
      confirmBtn.disabled = order.status === "confirmed" || order.status === "live";
      confirmBtn.addEventListener("click", () => updateOrderStatus(order, "confirmed"));

      const liveBtn = document.createElement("button");
      liveBtn.className = "action-btn action-live";
      liveBtn.textContent = "Live";
      liveBtn.disabled = order.status === "live";
      liveBtn.addEventListener("click", () => updateOrderStatus(order, "live"));

      actionWrap.appendChild(confirmBtn);
      actionWrap.appendChild(liveBtn);
      actionTd.appendChild(actionWrap);
      row.appendChild(actionTd);

      table.appendChild(row);
    });
  }

  async function loadOrders() {
    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error(error);
      setStatus(`Load failed: ${error.message}`);
      return;
    }

    ordersCount.textContent = `${data.length} orders`;
    renderRows(data);
    setStatus("Orders loaded.");
  }

  refreshBtn.addEventListener("click", loadOrders);

  logoutBtn.addEventListener("click", async () => {
    await supabase.auth.signOut();
    window.location.href = "/index.html";
  });

  const ok = await requireAdmin();
  if (!ok) return;

  await loadOrders();
});