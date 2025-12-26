const nodemailer = require("nodemailer");

const sendEmail = async (options) => {
  // Create the transporter using your .env credentials
  const transporter = nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE, // "gmail"
    auth: {
      user: process.env.EMAIL_USERNAME, // Your email
      pass: process.env.EMAIL_PASSWORD, // Your App Password
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