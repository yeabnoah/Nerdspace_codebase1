import nodemailer from "nodemailer";

interface emailInput {
  to: string;
  subject: string;
  text: string;
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

const sendEmail = async ({ to, subject, text }: emailInput) => {
  const info = await transporter.sendMail({
    from: "NerdSpace Team",
    to: `${to}`,
    subject: `${subject}`,
    text: `${text}`,
  });

  console.log("Message sent: %s", info.messageId);
};

export default sendEmail;
