const { Resend } = require("resend");
const dotenv = require("dotenv");

dotenv.config();

const resend = new Resend(process.env.RESEND_API_KEY);

async function sendEmail(to, subject, html) {
  try {
    const data = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL,
      to: [to],
      subject: subject,
      html: html,
    });

    console.log("Email sent successfully:", data);
    return data;
  } catch (error) {
    console.error("Email sending failed:", error);

    // More detailed error logging
    if (error.message) {
      console.error("Error message:", error.message);
    }
    if (error.name) {
      console.error("Error type:", error.name);
    }

    throw error;
  }
}

module.exports = { sendEmail };
