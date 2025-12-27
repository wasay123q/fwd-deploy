const nodemailer = require("nodemailer");

const sendEmail = async (options) => {
  // ✅ FIX: Use explicit Host and Port (465) to prevent timeouts on Render
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  // Define the email options
  const mailOptions = {
    from: `"Tourist App - No Reply" <${process.env.EMAIL_USERNAME}>`,
    to: options.email,
    subject: options.subject,
    text: options.message,
    // HTML version so the link is clickable
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px;">
        <h2>Password Reset Request</h2>
        <p>You (or someone else) requested a password reset for your account.</p>
        <p>Click the button below to reset it:</p>
        <a href="${options.message.split('PUT request to: \n\n ')[1]}" 
           style="background-color: #0ea5e9; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block; margin-top: 10px;">
           Reset Password
        </a>
        <p style="margin-top: 20px; color: #666;">If you didn't request this, you can ignore this email.</p>
      </div>
    `,
  };

  // Send the email
  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;