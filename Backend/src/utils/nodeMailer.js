const { Resend } = require("resend");
const dotenv = require("dotenv");

dotenv.config();
const resend = new Resend(process.env.RESEND_API_KEY);

async function sendEmail(to, subject, html) {
  try {
    const data = await resend.emails.send({
      from: process.env.EMAIL_FROM, // onboarding@resend.dev
      to,
      subject,
      html,
    });

    console.log("Email sent:", data);
    return data;
  } catch (err) {
    console.error("Email error:", err);
    throw err;
  }
}

module.exports = { sendEmail };
