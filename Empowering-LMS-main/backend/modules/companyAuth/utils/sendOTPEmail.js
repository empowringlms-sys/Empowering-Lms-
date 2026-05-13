const sendEmail = require("../../../utils/sendEmail");
const ms = require("ms");

const sendOTPEmail = async (to, otp) => {
  const subject = "Your Empowerings LMS Verification Code";
  const OTP_EXPIRY_TIME = Number(process.env.OTP_EXPIRY_TIME) || 600000; // Default to 10 minutes if not set

  // Convert milliseconds to human readable format
  let expiryText;
  try {
    expiryText = ms(parseInt(OTP_EXPIRY_TIME), { long: true });
  } catch (error) {
    // Fallback to minutes calculation if ms library fails
    const minutes = Math.floor(parseInt(OTP_EXPIRY_TIME) / 60000);
    expiryText = `${minutes} minute${minutes !== 1 ? "s" : ""}`;
  }

  const html = `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>OTP Verification</title>
  </head>
  <body style="margin:0; padding:0; background-color:#f4f6f8; font-family: Arial, Helvetica, sans-serif;">

    <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f6f8; padding:40px 0;">
      <tr>
        <td align="center">

          <!-- Main Card -->
          <table width="100%" cellpadding="0" cellspacing="0"
            style="max-width:600px; background:#ffffff; border-radius:14px; box-shadow:0 10px 35px rgba(0,0,0,0.08); overflow:hidden;">

            <!-- Header -->
            <tr>
              <td style="background:linear-gradient(135deg, #10b981 0%, #059669 100%); padding:32px; text-align:center;">
                <h1 style="margin:0; font-size:26px; color:#ffffff; font-weight:700;">
                  Empowerings LMS
                </h1>
                <p style="margin:8px 0 0; color:#d1fae5; font-size:14px;">
                  Learning that Empowers You
                </p>
              </td>
            </tr>

            <!-- Body -->
            <tr>
              <td style="padding:38px 42px; text-align:center; color:#1f2937;">
                <h2 style="margin-top:0; font-size:22px; font-weight:600;">
                  Verify Your Account
                </h2>

                <p style="font-size:15px; color:#4b5563; line-height:1.7;">
                  Please use the verification code below to securely complete your login.
                </p>

                <!-- OTP Box -->
                <div style="
                  margin:32px 0;
                  padding:20px 0;
                  border-radius:12px;
                  background:#f0fdf4;
                  border:1px dashed #10b981;">
                  <span style="
                    display:block;
                    font-size:34px;
                    font-weight:700;
                    letter-spacing:6px;
                    color:#059669;">
                    ${otp}
                  </span>
                </div>

                <p style="font-size:14px; color:#6b7280;">
                  This code will expire in <strong>${expiryText}</strong>.
                </p>

                <p style="font-size:14px; color:#6b7280; margin-top:26px;">
                  If you did not request this verification, please ignore this email or contact our support team.
                </p>
              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td style="background:#f9fafb; padding:22px 40px; text-align:center;">
                <p style="margin:0; font-size:13px; color:#9ca3af;">
                  © ${new Date().getFullYear()} Empowerings LMS. All rights reserved.
                </p>
                <p style="margin:6px 0 0; font-size:12px; color:#9ca3af;">
                  Secure • Reliable • Empowering Education
                </p>
              </td>
            </tr>

          </table>

        </td>
      </tr>
    </table>

  </body>
  </html>
  `;

  try {
    await sendEmail(to, subject, html);
  } catch (error) {
    console.error("Error sending OTP email:", error);
    throw new Error("Failed to send OTP email");
  }
};

module.exports = sendOTPEmail;
