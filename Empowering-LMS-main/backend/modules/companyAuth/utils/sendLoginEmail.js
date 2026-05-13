const nodemailer = require("nodemailer");

const sendLoginEmail = async (email, name, loginTime, dashboardUrl) => {
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.EMAIL,
            pass: process.env.EMAIL_APP_PASSWORD,
        },
    });

    const formattedTime = new Date(loginTime).toLocaleString("en-US", {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });

    const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Login Alert</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      background-color: #f0fdf4; /* emerald-50 */
      color: #064e3b; /* emerald-900 */
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      background-color: #ffffff;
      border-radius: 16px;
      overflow: hidden;
      box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05); /* Soft shadow */
      margin-top: 20px;
      margin-bottom: 20px;
    }
    .header {
      background: linear-gradient(to right, #10b981, #059669); /* emerald-500 to emerald-600 */
      padding: 40px 20px;
      text-align: center;
    }
    .header-icon {
      background-color: rgba(255, 255, 255, 0.2);
      width: 64px;
      height: 64px;
      border-radius: 50%;
      margin: 0 auto 20px;
      text-align: center;
      line-height: 64px;
      font-size: 32px;
      color: white;
      box-shadow: 0 4px 6px rgba(0,0,0,0.1);
    }
    .header h1 {
      color: white;
      margin: 0;
      font-size: 26px;
      font-weight: 700;
      letter-spacing: -0.5px;
    }
    .content {
      padding: 40px 30px;
    }
    .greeting {
      font-size: 18px;
      margin-bottom: 20px;
      color: #1f2937; /* gray-800 */
    }
    .info-box {
      background-color: #ecfdf5; /* emerald-50 */
      border: 1px solid #d1fae5; /* emerald-100 */
      border-radius: 12px;
      padding: 24px;
      margin: 25px 0;
    }
    .info-label {
      font-size: 13px;
      color: #059669; /* emerald-600 */
      text-transform: uppercase;
      letter-spacing: 0.05em;
      margin-bottom: 6px;
      display: block;
      font-weight: 600;
    }
    .info-value {
      font-size: 16px;
      font-weight: 600;
      color: #111827; /* gray-900 */
    }
    .alert-text {
      font-size: 14px;
      color: #991b1b; /* red-800 */
      background-color: #fef2f2; /* red-50 */
      padding: 16px;
      border-radius: 8px;
      margin-top: 25px;
      border: 1px solid #fecaca; /* red-200 */
      border-left: 4px solid #ef4444; /* red-500 */
      line-height: 1.5;
    }
    .btn-container {
      text-align: center;
      margin-top: 35px;
    }
    .btn {
      display: inline-block;
      background-color: #059669; /* emerald-600 */
      color: #ffffff !important;
      text-decoration: none;
      padding: 16px 36px;
      border-radius: 8px;
      font-weight: 600;
      font-size: 16px;
      box-shadow: 0 4px 6px -1px rgba(5, 150, 105, 0.3);
      transition: background-color 0.2s, transform 0.1s;
    }
    .btn:hover {
      background-color: #047857; /* emerald-700 */
      transform: translateY(-1px);
    }
    .footer {
      background-color: #f9fafb; /* gray-50 */
      padding: 24px;
      text-align: center;
      font-size: 13px;
      color: #9ca3af; /* gray-400 */
      border-top: 1px solid #f3f4f6;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="header-icon">🔒</div>
      <h1>New Login Detected</h1>
    </div>
    
    <div class="content">
      <p class="greeting">Hello <strong>${name}</strong>,</p>
      <p style="line-height: 1.6;">
        We detected a new login to your Empowerings LMS account.
      </p>

      <div class="info-box">
        <div style="margin-bottom: 15px;">
          <span class="info-label">Account Email</span>
          <span class="info-value">${email}</span>
        </div>
        <div>
          <span class="info-label">Date & Time</span>
          <span class="info-value">${formattedTime}</span>
        </div>
      </div>

      <div class="alert-text">
        If this was you, you can safely ignore this email. <br/>
        <strong>If you did not log in, please secure your account immediately.</strong>
      </div>

       <div class="btn-container">
        <a href="${dashboardUrl}" class="btn" style="color:#ffffff !important; text-decoration:none;">Go to Dashboard</a>
      </div>
    </div>

    <div class="footer">
      <p>&copy; ${new Date().getFullYear()} Empowerings LMS. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
`;

    const mailOptions = {
        from: `"Empowerings LMS Security" <${process.env.EMAIL}>`,
        to: email,
        subject: `Security Alert: New Login to Empowerings LMS`,
        html: htmlContent,
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log("Login email sent: " + info.messageId);
        return true;
    } catch (error) {
        console.error("Error sending login email:", error);
        return false;
    }
};

module.exports = sendLoginEmail;
