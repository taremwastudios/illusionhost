function selectMethod(method) {
  const container = document.getElementById("payment-content");

  if (method === "mtn" || method === "airtel") {
    container.innerHTML = `
      <h3>${method.toUpperCase()} Payment</h3>
      <p>Send money to: 077XXXXXXX</p>

      <input type="text" id="txid" placeholder="Enter Transaction ID">
      <button onclick="submitTx('${method}')">Confirm Payment</button>
    `;
  }

  if (method === "merchant") {
    container.innerHTML = `
      <h3>Merchant Payment</h3>
      <p>Click below to view steps and generate reference.</p>

      <button onclick="generateRef()">Generate Reference Number</button>

      <div id="merchant-steps"></div>
    `;
  }
}

function generateRef() {
  const ref = Math.floor(1000000000 + Math.random() * 9000000000);

  document.getElementById("merchant-steps").innerHTML = `
    <h4>Steps:</h4>
    <p>1. Dial *185#</p>
    <p>2. Select Payments</p>
    <p>3. Enter Merchant ID</p>
    <p>4. Enter Amount</p>

    <p><strong>Your Reference Number:</strong> ${ref}</p>
  `;

  // Store for admin later
  localStorage.setItem("lastRef", ref);
}

function submitTx(method) {
  const txid = document.getElementById("txid").value;

  if (!txid) {
    alert("Enter transaction ID");
    return;
  }

  const payment = {
    method,
    txid,
    time: new Date().toISOString()
  };

  let payments = JSON.parse(localStorage.getItem("payments")) || [];
  payments.push(payment);

  localStorage.setItem("payments", JSON.stringify(payments));

  alert("Payment submitted! Await verification.");
}