import nodemailer from "nodemailer";

export const sendVerificationEmail = (code: string, email: string) => {
  console.log(code, email);

  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: process.env.GOOGLE_EMAIL,
      pass: process.env.GOOGLE_APP_PASSWORD,
    },
  });

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <title>Verify Your Email</title>
        <style>
          .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            font-family: Arial, sans-serif;
          }
          .header {
            background-color: #fff;
            padding: 20px;
            text-align: center;
            border-radius: 5px 5px 0 0;
          }
          .content {
            background-color: #ffffff;
            padding: 20px;
            border: 1px solid #e5e7eb;
            border-radius: 0 0 5px 5px;
          }
          .verification-code {
            font-size: 32px;
            font-weight: bold;
            text-align: center;
            color: #4F46E5;
            padding: 20px;
            margin: 20px 0;
            background-color: #f3f4f6;
            border-radius: 5px;
            letter-spacing: 5px;
          }
          .footer {
            text-align: center;
            margin-top: 20px;
            color: #6b7280;
            font-size: 12px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Email Verification</h1>
          </div>
          <div class="content">
            <p>Hello,</p>
            <p>Thank you for registering with NoteFusion. To complete your registration, please use the following verification code:</p>
            <div class="verification-code">${code}</div>
            <p>This code will expire in 10 minutes.</p>
            <p>If you didn't request this verification code, please ignore this email.</p>
          </div>
          <div class="footer">
            <p>This is an automated message, please do not reply.</p>
            <p>&copy; ${new Date().getFullYear()} NoteFusion. All rights reserved.</p>
          </div>
        </div>
      </body>
    </html>
  `;

  (async () => {
    const info = await transporter.sendMail({
      from: "NoteFusion Verification Code",
      to: email,
      subject: "NoteFusion Verification Code",
      html: html,
    });

    console.log("Message sent:", info.messageId);
  })();
};
