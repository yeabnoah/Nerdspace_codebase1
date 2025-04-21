import nodemailer from "nodemailer";

interface emailInput {
  to: string;
  subject: string;
  text?: string;
  html?: string;
}

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendEmail = async ({ to, subject, text, html }: emailInput) => {
  const info = await transporter.sendMail({
    from: "NerdSpace Team",
    to: `${to}`,
    subject: `${subject}`,
    text: text || "",
    html: html,
  });

  console.log("Message sent: %s", info.messageId);
};

export default sendEmail;
