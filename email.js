// email.js
export async function sendEmail({ email, subdomain, order_id }) {
  try {
    const response = await fetch('https://api.resend.com/send', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'subdomains@illusionhost.com',
        to: email,
        subject: 'Preorder Confirmation',
        html: `<p>Thank you for preordering <strong>${subdomain}</strong>! Your order ID is <strong>${order_id}</strong>.</p>`,
      }),
    });

    const data = await response.json();
    if (!response.ok) throw new Error(JSON.stringify(data));
    return data;
  } catch (err) {
    console.error('Email sending failed:', err);
    throw err;
  }
}