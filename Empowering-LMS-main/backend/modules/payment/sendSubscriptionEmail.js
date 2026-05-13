const nodemailer = require("nodemailer");

const sendSubscriptionEmail = async (email, name, planDetails, adminUrl, password) => {
  console.log("sendSubscriptionEmail ---->>>", "email : ", email, "name : ", name, "planDetails : ", planDetails, "adminUrl : ", adminUrl)
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL,
      pass: process.env.EMAIL_APP_PASSWORD,
    },
  });

  const { planType, duration, expiryDate } = planDetails;

  // Format date nicely
  const formattedExpiry = new Date(expiryDate).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Subscription Confirmed</title>
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
      box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
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
        width: 72px;
        height: 72px;
        border-radius: 50%;
        margin: 0 auto 20px;
        text-align: center;
        line-height: 72px; /* 👈 THIS centers the ✓ vertically */
        font-size: 36px;
        color: white;
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
      color: #1f2937;
    }
    .card {
      background-color: #ffffff;
      border: 1px solid #e5e7eb;
      border-radius: 12px;
      padding: 24px;
      margin: 25px 0;
      box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
    }
    .card-title {
      font-size: 14px;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: #059669; /* emerald-600 */
      font-weight: 600;
      margin-bottom: 15px;
      border-bottom: 1px solid #d1fae5;
      padding-bottom: 10px;
    }
    .info-row {
      display: flex;
      justify-content: space-between;
      margin-bottom: 12px;
      font-size: 15px;
    }
    .info-label {
      color: #6b7280; /* gray-500 */
    }
    .info-value {
      font-weight: 600;
      color: #111827; /* gray-900 */
    }
    .credentials-box {
      background-color: #f8fafc; /* slate-50 */
      border: 1px border #e2e8f0; /* slate-200 */
      border-left: 4px solid #059669;
      border-radius: 6px;
      padding: 20px;
      margin-top: 30px;
      text-align: left;
    }
    .credentials-header {
      font-weight: 700;
      color: #334155; /* slate-700 */
      margin-bottom: 12px;
      display: block;
      font-size: 16px;
    }
    .btn-container {
      text-align: center;
      margin-top: 40px;
    }
      .btn {
      display: inline-block;
      background-color: #059669;
      color: #ffffff !important;   /* 👈 FORCE WHITE */
      text-decoration: none;
      padding: 16px 36px;
      border-radius: 8px;
      font-weight: 600;
      font-size: 16px;
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
      <div class="header-icon">✓</div>
      <h1>Payment Successful</h1>
    </div>
    
    <div class="content">
      <p class="greeting">Hello <strong>${name}</strong>,</p>
      <p style="color: #4b5563; line-height: 1.6; font-size: 15px;">
        Welcome to the family! Your subscription plan has been successfully activated. 
        You now have full access to our premium features.
      </p>

      <div class="card">
        <div class="card-title">Subscription Details</div>
        <div class="info-row">
          <span class="info-label">Plan Type</span>
          <span class="info-value" style="text-transform: capitalize;">${planType} Plan</span>
        </div>
        <div class="info-row">
          <span class="info-label">Duration</span>
          <span class="info-value">${duration} Month(s)</span>
        </div>
        <div class="info-row">
          <span class="info-label">Status</span>
          <span class="info-value" style="color: #059669;">Active</span>
        </div>
        <div class="info-row">
          <span class="info-label">Valid Until</span>
          <span class="info-value">${formattedExpiry}</span>
        </div>
      </div>

      <div class="credentials-box">
        <span class="credentials-header">Admin Panel Credentials</span>
        <div class="info-row">
          <span class="info-label">Email:</span>
          <span class="info-value">${email}</span>
        </div>
        <div class="info-row">
          <span class="info-label">Password:</span>
          <span class="info-value" style="font-family: monospace; background: #e2e8f0; padding: 2px 6px; rounded: 4px;">${password}</span>
        </div>
      </div>

       <div class="btn-container">
        <a href="${adminUrl}" 
          class="btn" 
          style="color:#ffffff !important; text-decoration:none;">
          Visit Admin Panel & Explore LMS
        </a>
      </div>
      
      <p style="text-align: center; margin-top: 30px; font-size: 14px; color: #6b7280;">
        If you have any questions, feel free to reply to this email.
      </p>
    </div>

    <div class="footer">
      <p>&copy; ${new Date().getFullYear()} Empowerings LMS. All rights reserved.</p>
      <p>This is an automated message, please do not reply directly if not needed.</p>
    </div>
  </div>
</body>
</html>
`;

  const mailOptions = {
    from: `"Empowerings LMS" < ${process.env.EMAIL}> `,
    to: email,
    subject: `Active Subscription - Welcome to Empowerings`,
    html: htmlContent,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Subscription email sent: " + info.messageId);
    return true;
  } catch (error) {
    console.error("Error sending subscription email:", error);
    return false;
  }
};

module.exports = sendSubscriptionEmail;
