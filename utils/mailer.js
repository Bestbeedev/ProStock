import nodemailer from "nodemailer";

// Configure le transporteur SMTP
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com", // Remplace par ton SMTP (Gmail, SendGrid, etc.)
  port: 587,
  secure: false, // true pour port 465
  auth: {
    user: "josueaoga0@gmail.com",
    pass: ""
  }
});

// Fonction pour envoyer un mail
const sendMail = async (to, subject, text, html = null) => {
  try {
    const info = await transporter.sendMail({
      from: '"ProStock" <no-reply@prostock.com>',
      to,
      subject,
      text,
      html
    });
    console.log("Mail envoyé: %s", info.messageId);
    return info;
  } catch (err) {
    console.error("Erreur mail: ", err);
    throw err;
  }
};

export default sendMail;
