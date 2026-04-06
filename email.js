import nodemailer from "nodemailer";

export async function sendEmail({ email, subdomain, order_id }) {
  // Replace with your Gmail or other SMTP credentials
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "your-email@gmail.com",
      pass: "your-email-app-password"
    }
  });

  const mailOptions = {
    from: "your-email@gmail.com",
    to: email,
    subject: `Preorder Confirmation: ${order_id}`,
    text: `Hello!\n\nYour preorder for ${subdomain} has been received.\nOrder ID: ${order_id}\n\nThanks!`
  };

  await transporter.sendMail(mailOptions);
}