import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { sendEmail } from "./email.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// In-memory orders (replace with DB in future)
let orders = [];

app.post("/send-email", async (req, res) => {
  const { email, subdomain, order_id } = req.body;
  if (!email || !subdomain || !order_id)
    return res.status(400).json({ success: false, error: "Missing parameters" });

  try {
    await sendEmail({ email, subdomain, order_id });
    orders.push({ email, subdomain, order_id }); // store for counter
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: "Failed to send email" });
  }
});

app.get("/orders/count", (req, res) => {
  res.json({ count: orders.length });
});

// Serve index.html for all other routes
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});