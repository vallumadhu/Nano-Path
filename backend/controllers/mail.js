const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: process.env.GMAIL_ADDRESS,
    pass: process.env.GMAIL_APP_PASS,
  },
});

transporter.verify((err, success) => {
  if (err) {
    console.error('SMTP verify error:', err);
  } else {
    console.log('SMTP server is ready to take our messages');
  }
});

const sendMail = async (to, sub, msg) => {
  try {
    const result = await transporter.sendMail({
      from: process.env.GMAIL_ADDRESS,
      to,
      subject: sub,
      html: msg,
    });
    console.log('Mail sent:', result.messageId);
    return result;
  } catch (err) {
    console.error('Mail error:', err);
    throw err;
  }
};

module.exports = sendMail;