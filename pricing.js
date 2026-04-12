document.addEventListener("DOMContentLoaded", () => {

  const area = document.getElementById("payment-area");

  function loadingState(btn) {
    btn.disabled = true;
    btn.innerHTML = "Processing...";
  }

  function resetButton(btn, text) {
    btn.disabled = false;
    btn.innerHTML = text;
  }

  window.selectMethod = function(method) {

    if (method === "mtn" || method === "airtel") {
      area.innerHTML = `
        <h3>${method.toUpperCase()} Payment</h3>

        <p>Send payment manually and enter transaction ID below:</p>

        <input id="txid" placeholder="Transaction ID">

        <button id="confirm-btn" class="sharp-btn">
          <span class="btn-label">Confirm Payment</span>
          <span class="btn-spinner"></span>
        </button>

        <p id="payment-status"></p>
      `;

      document.getElementById("confirm-btn").addEventListener("click", async (e) => {
        const btn = e.target.closest("button");
        const status = document.getElementById("payment-status");
        const txid = document.getElementById("txid").value;

        if (!txid) {
          status.innerText = "Enter transaction ID";
          return;
        }

        loadingState(btn);
        status.innerText = "Verifying payment...";

        setTimeout(() => {
          status.innerText = "✅ Payment submitted for verification";
          resetButton(btn, "Confirm Payment");
        }, 2000);
      });
    }

    if (method === "merchant") {
      area.innerHTML = `
        <h3>Merchant Payment</h3>

        <button id="gen-btn" class="sharp-btn">
          <span class="btn-label">Generate Reference</span>
          <span class="btn-spinner"></span>
        </button>

        <div id="merchant-box"></div>
      `;

      document.getElementById("gen-btn").addEventListener("click", (e) => {
        const btn = e.target.closest("button");
        const box = document.getElementById("merchant-box");

        loadingState(btn);

        setTimeout(() => {

          const ref = Math.floor(1000000000 + Math.random() * 9000000000);

          box.innerHTML = `
            <h4>Payment Steps</h4>
            <p>1. Dial *185#</p>
            <p>2. Select Payments</p>
            <p>3. Enter Merchant ID</p>
            <p>4. Enter Amount</p>

            <h3>Your Reference:</h3>
            <div class="ref-box">${ref}</div>
          `;

          resetButton(btn, "Generate Reference");

        }, 1500);
      });
    }
  };

});