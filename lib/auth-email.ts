import nodemailer from 'nodemailer';
import { AUTH_CONFIG } from './auth-jwt';

// Generate random 6-digit OTP
export function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Create email transporter
export function createEmailTransporter() {
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    throw new Error('SMTP credentials not configured');
  }

  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: false, // Use STARTTLS (Gmail supports both 587 and 465)
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
    tls: {
      // For Gmail, allow less secure TLS versions if needed
      rejectUnauthorized: false
    }
  });
}

// Send OTP email
export async function sendOTPEmail(email: string, code: string): Promise<void> {
  const transporter = createEmailTransporter();

  const mailOptions = {
    from: `"CMG Tools Hub" <${process.env.SMTP_USER}>`,
    to: email,
    subject: 'Your CMG Tools Hub Access Code',
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
              background-color: #0D0D0D;
              color: #ffffff;
              margin: 0;
              padding: 0;
            }
            .container {
              max-width: 600px;
              margin: 40px auto;
              background: linear-gradient(to bottom right, #1a1a1a, #0d0d0d);
              border-radius: 12px;
              border: 1px solid rgba(255, 255, 255, 0.1);
              overflow: hidden;
            }
            .header {
              background: linear-gradient(135deg, #00FF88 0%, #00D4FF 100%);
              padding: 30px;
              text-align: center;
            }
            .header h1 {
              margin: 0;
              color: #0D0D0D;
              font-size: 24px;
              font-weight: bold;
            }
            .content {
              padding: 40px 30px;
            }
            .code-box {
              background: rgba(0, 255, 136, 0.1);
              border: 2px solid #00FF88;
              border-radius: 8px;
              padding: 20px;
              text-align: center;
              margin: 30px 0;
            }
            .code {
              font-size: 36px;
              font-weight: bold;
              letter-spacing: 8px;
              color: #00FF88;
              font-family: 'Courier New', monospace;
            }
            .warning {
              background: rgba(255, 107, 53, 0.1);
              border-left: 4px solid #FF6B35;
              padding: 15px;
              margin: 20px 0;
              border-radius: 4px;
            }
            .footer {
              background: rgba(255, 255, 255, 0.05);
              padding: 20px;
              text-align: center;
              font-size: 12px;
              color: #999;
            }
            a {
              color: #00D4FF;
              text-decoration: none;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🏠 CMG Tools Hub</h1>
            </div>
            <div class="content">
              <h2 style="color: #00FF88; margin-top: 0;">Your Access Code</h2>
              <p>Hello! Someone requested access to the CMG Tools Hub using this email address.</p>

              <div class="code-box">
                <div style="color: #999; font-size: 12px; margin-bottom: 10px;">VERIFICATION CODE</div>
                <div class="code">${code}</div>
                <div style="color: #999; font-size: 12px; margin-top: 10px;">Valid for ${AUTH_CONFIG.OTP_EXPIRY_MINUTES} minutes</div>
              </div>

              <p>Enter this code on the login page to access your dashboard.</p>

              <div class="warning">
                <strong>⚠️ Security Notice:</strong><br>
                • This code expires in ${AUTH_CONFIG.OTP_EXPIRY_MINUTES} minutes<br>
                • You have ${AUTH_CONFIG.MAX_ATTEMPTS} attempts to enter it correctly<br>
                • If you didn't request this code, please ignore this email
              </div>

              <p style="margin-top: 30px; color: #999; font-size: 14px;">
                <strong>Need help?</strong> Contact your IT administrator or visit
                <a href="https://product.cmgfinancial.ai">product.cmgfinancial.ai</a>
              </p>
            </div>
            <div class="footer">
              <p>CMG Financial | 3160 Crow Canyon Road Suite 400, San Ramon, CA 94583</p>
              <p>This is an automated message. Please do not reply to this email.</p>
            </div>
          </div>
        </body>
      </html>
    `,
    text: `
Your CMG Tools Hub Access Code: ${code}

This code will expire in ${AUTH_CONFIG.OTP_EXPIRY_MINUTES} minutes.

If you didn't request this code, please ignore this email.

CMG Financial
https://product.cmgfinancial.ai
    `,
  };

  await transporter.sendMail(mailOptions);
}
