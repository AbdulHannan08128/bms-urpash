// sendEmail.js
'use server'
import nodemailer from 'nodemailer';

const sendEmail = async (emailOptions) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'mohammadayaan08128@gmail.com',
      pass: 'aeib kgtv mvev wqdl', // Use the generated App Password here
    },
  });

  const mailOptions = {
    from: 'mohammadayaan08128@gmail.com',
    to: emailOptions.to,
    subject: emailOptions.subject,
    text: emailOptions.text,
    html: emailOptions.html,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully. Message ID:', info.messageId);
    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    return false;
  }
};

export default sendEmail;
