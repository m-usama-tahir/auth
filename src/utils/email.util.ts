import nodemailer from "nodemailer";

/**
 * Send an email using Nodemailer.
 *
 * @function
 * @memberof module:utils/email
 * @name sendEmail
 * @param {Object} options - The email options.
 * @param {string} options.email - The recipient's email address.
 * @param {string} options.subject - The email subject.
 * @param {string} options.message - The email body text.
 * @returns {Promise<void>} A Promise that resolves when the email is sent.
 */
export const sendEmail = async (options: any) => {
  // 1) Create a Transporter
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: parseInt(process.env.EMAIL_PORT || "587", 10),
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  // 2) Define the email options
  const mailOptions = {
    from: "abc@company.com",
    to: options.email,
    subject: options.subject,
    text: options.message,
  };

  // 3) Actually send the email
  await transporter.sendMail(mailOptions);
};
