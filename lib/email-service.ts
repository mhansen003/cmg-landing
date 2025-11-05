/**
 * Email Notification Service
 * Sends email notifications using Gmail SMTP
 */

import nodemailer from 'nodemailer';

interface ToolNotification {
  toolId: string;
  title: string;
  description: string;
  category: string;
  url: string;
  createdBy: string;
  thumbnailUrl?: string;
}

// Create reusable transporter using Gmail SMTP
const createTransporter = () => {
  const smtpHost = process.env.SMTP_HOST;
  const smtpPort = process.env.SMTP_PORT;
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;

  if (!smtpHost || !smtpPort || !smtpUser || !smtpPass) {
    console.error('[Email Service] SMTP configuration missing! Check .env.local for SMTP_* variables.');
    return null;
  }

  return nodemailer.createTransport({
    host: smtpHost,
    port: parseInt(smtpPort),
    secure: false, // Use TLS
    auth: {
      user: smtpUser,
      pass: smtpPass,
    },
  });
};

/**
 * Send email notification for pending tool approval
 * Uses Gmail SMTP
 */
export async function sendPendingApprovalEmail(
  tool: ToolNotification,
  siteUrl: string
): Promise<boolean> {
  try {
    const transporter = createTransporter();

    if (!transporter) {
      console.error('[Email Service] SMTP not configured! Email notifications will not be sent.');
      return false;
    }

    console.log(`[Email Service] Preparing approval email for tool: ${tool.title}`);

    // Build deep link to pending queue with highlighted tool
    const approvalLink = `${siteUrl}?view=pending#${tool.toolId}`;

    // Email HTML content
    const emailHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
      background-color: #f5f5f5;
    }
    .container {
      background-color: #ffffff;
      border-radius: 12px;
      padding: 30px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }
    .header {
      background: linear-gradient(135deg, #00FF88 0%, #00D4FF 100%);
      color: #1a1a1a;
      padding: 20px;
      border-radius: 8px;
      margin-bottom: 25px;
    }
    .header h1 {
      margin: 0;
      font-size: 24px;
      font-weight: 700;
    }
    .tool-card {
      background-color: #f9f9f9;
      border-left: 4px solid #00FF88;
      padding: 20px;
      margin: 20px 0;
      border-radius: 6px;
    }
    .tool-title {
      font-size: 20px;
      font-weight: 700;
      color: #1a1a1a;
      margin: 0 0 10px 0;
    }
    .tool-meta {
      color: #666;
      font-size: 14px;
      margin: 5px 0;
    }
    .tool-description {
      color: #444;
      margin: 15px 0;
      line-height: 1.5;
    }
    .cta-button {
      display: inline-block;
      background: linear-gradient(135deg, #00FF88 0%, #00D4FF 100%);
      color: #1a1a1a;
      text-decoration: none;
      padding: 14px 30px;
      border-radius: 8px;
      font-weight: 700;
      margin: 20px 0;
      transition: transform 0.2s;
    }
    .cta-button:hover {
      transform: translateY(-2px);
    }
    .footer {
      margin-top: 30px;
      padding-top: 20px;
      border-top: 1px solid #e0e0e0;
      color: #666;
      font-size: 12px;
      text-align: center;
    }
    .thumbnail {
      max-width: 100%;
      height: auto;
      border-radius: 8px;
      margin: 15px 0;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🔔 New Tool Pending Approval</h1>
    </div>

    <p>A new tool has been submitted to the CMG Tools Hub and is waiting for your approval.</p>

    <div class="tool-card">
      <h2 class="tool-title">${tool.title}</h2>
      <div class="tool-meta">
        <strong>Category:</strong> ${tool.category || 'Uncategorized'}<br>
        <strong>Submitted by:</strong> ${tool.createdBy}<br>
        <strong>URL:</strong> <a href="${tool.url}" target="_blank">${tool.url}</a>
      </div>
      ${tool.thumbnailUrl ? `<img src="${tool.thumbnailUrl}" alt="${tool.title} screenshot" class="thumbnail" />` : ''}
      <div class="tool-description">
        ${tool.description}
      </div>
    </div>

    <div style="text-align: center;">
      <a href="${approvalLink}" class="cta-button">
        Review & Approve Tool →
      </a>
    </div>

    <p style="color: #666; font-size: 14px; margin-top: 20px;">
      Click the button above to review the tool details and approve or reject the submission.
      The tool will remain in the pending queue until you take action.
    </p>

    <div class="footer">
      <p>
        This is an automated notification from CMG Tools Hub.<br>
        You're receiving this because you're an administrator.
      </p>
    </div>
  </div>
</body>
</html>
    `.trim();

    // Send email using Gmail SMTP
    const info = await transporter.sendMail({
      from: `"CMG Tools Hub" <${process.env.SMTP_USER}>`,
      to: 'mhansen@cmgfi.com',
      subject: `🔔 New Tool Pending Approval: ${tool.title}`,
      html: emailHtml,
    });

    console.log('[Email Service] ✅ Approval email sent successfully to mhansen@cmgfi.com');
    console.log('[Email Service] Message ID:', info.messageId);

    return true;
  } catch (error) {
    console.error('[Email Service] ❌ Failed to send approval email:', error);
    return false;
  }
}

/**
 * Send email notification when a tool is rejected
 */
export async function sendRejectionEmail(
  tool: ToolNotification,
  rejectedBy: string,
  recipientEmail: string,
  rejectionReason: string,
  siteUrl: string
): Promise<boolean> {
  try {
    const transporter = createTransporter();

    if (!transporter) {
      console.warn('[Email Service] SMTP not configured, skipping rejection email');
      return false;
    }

    // Build edit link - we'll just link back to the main page where they can add a new tool
    // In a full implementation, you might create a special token to allow editing the rejected tool
    const editLink = `${siteUrl}`;

    const emailHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
      background-color: #f5f5f5;
    }
    .container {
      background-color: #ffffff;
      border-radius: 12px;
      padding: 30px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }
    .header {
      background: linear-gradient(135deg, #EF4444 0%, #DC2626 100%);
      color: #ffffff;
      padding: 20px;
      border-radius: 8px;
      margin-bottom: 25px;
      text-align: center;
    }
    .header h1 {
      margin: 0;
      font-size: 24px;
      font-weight: 700;
    }
    .rejection-icon {
      font-size: 48px;
      margin-bottom: 10px;
    }
    .reason-box {
      background-color: #FEF2F2;
      border-left: 4px solid #EF4444;
      padding: 15px;
      margin: 20px 0;
      border-radius: 6px;
    }
    .reason-label {
      font-size: 12px;
      text-transform: uppercase;
      color: #DC2626;
      font-weight: 700;
      margin-bottom: 8px;
    }
    .reason-text {
      color: #1a1a1a;
      line-height: 1.6;
    }
    .cta-button {
      display: inline-block;
      background: linear-gradient(135deg, #00FF88 0%, #00D4FF 100%);
      color: #1a1a1a;
      text-decoration: none;
      padding: 14px 30px;
      border-radius: 8px;
      font-weight: 700;
      margin: 20px 0;
    }
    .footer {
      margin-top: 30px;
      padding-top: 20px;
      border-top: 1px solid #e0e0e0;
      color: #666;
      font-size: 12px;
      text-align: center;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="rejection-icon">⚠️</div>
      <h1>Tool Submission Needs Revision</h1>
    </div>

    <p>Your tool submission "<strong>${tool.title}</strong>" has been reviewed and requires some changes before it can be approved.</p>

    <div class="reason-box">
      <div class="reason-label">Reason for Rejection</div>
      <div class="reason-text">${rejectionReason}</div>
    </div>

    <p><strong>What happens next?</strong></p>
    <ul>
      <li>Review the feedback provided above</li>
      <li>Make the necessary changes to your tool submission</li>
      <li>Resubmit your tool for approval</li>
    </ul>

    <div style="text-align: center;">
      <a href="${editLink}" class="cta-button">
        Submit Updated Tool →
      </a>
    </div>

    <p style="color: #666; font-size: 14px; margin-top: 20px;">
      If you have any questions about this feedback, please contact ${rejectedBy} or reply to this email.
    </p>

    <div class="footer">
      <p>
        This is an automated notification from CMG Tools Hub.<br>
        Reviewed by: ${rejectedBy}
      </p>
    </div>
  </div>
</body>
</html>
    `.trim();

    const info = await transporter.sendMail({
      from: `"CMG Tools Hub" <${process.env.SMTP_USER}>`,
      to: recipientEmail,
      subject: `Tool Submission Needs Revision: ${tool.title}`,
      html: emailHtml,
    });

    console.log('[Email Service] ✅ Rejection email sent to', recipientEmail);
    console.log('[Email Service] Message ID:', info.messageId);
    return true;
  } catch (error) {
    console.error('[Email Service] ❌ Failed to send rejection email:', error);
    return false;
  }
}

/**
 * Send email notification when a tool is approved
 */
export async function sendApprovalConfirmationEmail(
  tool: ToolNotification,
  approvedBy: string,
  recipientEmail: string,
  siteUrl: string
): Promise<boolean> {
  try {
    const transporter = createTransporter();

    if (!transporter) {
      console.warn('[Email Service] SMTP not configured, skipping email notification');
      return false;
    }

    const toolLink = `${siteUrl}#${tool.toolId}`;

    const emailHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
      background-color: #f5f5f5;
    }
    .container {
      background-color: #ffffff;
      border-radius: 12px;
      padding: 30px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }
    .header {
      background: linear-gradient(135deg, #00FF88 0%, #00D4FF 100%);
      color: #1a1a1a;
      padding: 20px;
      border-radius: 8px;
      margin-bottom: 25px;
      text-align: center;
    }
    .header h1 {
      margin: 0;
      font-size: 24px;
      font-weight: 700;
    }
    .success-icon {
      font-size: 48px;
      margin-bottom: 10px;
    }
    .cta-button {
      display: inline-block;
      background: linear-gradient(135deg, #00FF88 0%, #00D4FF 100%);
      color: #1a1a1a;
      text-decoration: none;
      padding: 14px 30px;
      border-radius: 8px;
      font-weight: 700;
      margin: 20px 0;
    }
    .footer {
      margin-top: 30px;
      padding-top: 20px;
      border-top: 1px solid #e0e0e0;
      color: #666;
      font-size: 12px;
      text-align: center;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="success-icon">✅</div>
      <h1>Tool Approved!</h1>
    </div>

    <p>Great news! Your tool submission has been approved and is now live on the CMG Tools Hub.</p>

    <div style="background-color: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
      <h2 style="margin: 0 0 10px 0; color: #1a1a1a;">${tool.title}</h2>
      <p style="color: #666; margin: 5px 0;"><strong>Approved by:</strong> ${approvedBy}</p>
    </div>

    <p>Users can now discover and use your tool. Thank you for contributing to the CMG Tools Hub!</p>

    <div style="text-align: center;">
      <a href="${toolLink}" class="cta-button">
        View Your Tool →
      </a>
    </div>

    <div class="footer">
      <p>
        This is an automated notification from CMG Tools Hub.
      </p>
    </div>
  </div>
</body>
</html>
    `.trim();

    const info = await transporter.sendMail({
      from: `"CMG Tools Hub" <${process.env.SMTP_USER}>`,
      to: recipientEmail,
      subject: `✅ Your tool "${tool.title}" has been approved!`,
      html: emailHtml,
    });

    console.log('[Email Service] ✅ Approval confirmation email sent to', recipientEmail);
    console.log('[Email Service] Message ID:', info.messageId);
    return true;
  } catch (error) {
    console.error('[Email Service] ❌ Failed to send confirmation email:', error);
    return false;
  }
}
