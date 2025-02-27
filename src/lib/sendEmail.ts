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
    user: "yeabnoah5@gmail.com",
    pass: "iepbhmcovlxjuikj",
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
