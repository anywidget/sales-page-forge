// Resend email service for password reset functionality
import { Resend } from 'resend';

let connectionSettings: any;

async function getCredentials() {
  const hostname = process.env.REPLIT_CONNECTORS_HOSTNAME;
  const xReplitToken = process.env.REPL_IDENTITY
    ? 'repl ' + process.env.REPL_IDENTITY
    : process.env.WEB_REPL_RENEWAL
    ? 'depl ' + process.env.WEB_REPL_RENEWAL
    : null;

  if (!xReplitToken) {
    throw new Error('X_REPLIT_TOKEN not found for repl/depl');
  }

  connectionSettings = await fetch(
    'https://' + hostname + '/api/v2/connection?include_secrets=true&connector_names=resend',
    {
      headers: {
        'Accept': 'application/json',
        'X_REPLIT_TOKEN': xReplitToken
      }
    }
  ).then(res => res.json()).then(data => data.items?.[0]);

  if (!connectionSettings || (!connectionSettings.settings.api_key)) {
    throw new Error('Resend not connected');
  }
  return { apiKey: connectionSettings.settings.api_key, fromEmail: connectionSettings.settings.from_email };
}

// Get a fresh Resend client - never cache this
async function getResendClient() {
  const { apiKey, fromEmail } = await getCredentials();
  return {
    client: new Resend(apiKey),
    fromEmail
  };
}

export async function sendPasswordResetEmail(toEmail: string, resetToken: string, resetUrl: string) {
  const { client, fromEmail } = await getResendClient();

  const result = await client.emails.send({
    from: fromEmail || 'Sales Page Forge <noreply@resend.dev>',
    to: toEmail,
    subject: 'Reset Your Password - Sales Page Forge',
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #111827; color: #fff; padding: 40px 20px; margin: 0;">
          <div style="max-width: 480px; margin: 0 auto; background-color: #1f2937; border-radius: 12px; padding: 40px; border: 1px solid #374151;">
            <div style="text-align: center; margin-bottom: 32px;">
              <div style="display: inline-block; width: 48px; height: 48px; background: linear-gradient(135deg, #10b981 0%, #06b6d4 100%); border-radius: 12px; margin-bottom: 16px;"></div>
              <h1 style="margin: 0; font-size: 24px; font-weight: 700; color: #fff;">Sales Page Forge</h1>
            </div>
            
            <h2 style="font-size: 20px; font-weight: 600; margin: 0 0 16px; color: #fff;">Reset Your Password</h2>
            
            <p style="font-size: 16px; color: #9ca3af; line-height: 1.6; margin: 0 0 24px;">
              We received a request to reset your password. Click the button below to create a new password. This link will expire in 1 hour.
            </p>
            
            <a href="${resetUrl}" style="display: block; width: 100%; padding: 14px 24px; background: linear-gradient(135deg, #10b981 0%, #06b6d4 100%); color: #fff; text-decoration: none; border-radius: 8px; font-size: 16px; font-weight: 600; text-align: center; box-sizing: border-box;">
              Reset Password
            </a>
            
            <p style="font-size: 14px; color: #6b7280; line-height: 1.6; margin: 24px 0 0;">
              If you didn't request this password reset, you can safely ignore this email. Your password won't be changed.
            </p>
            
            <hr style="border: none; border-top: 1px solid #374151; margin: 32px 0;">
            
            <p style="font-size: 12px; color: #6b7280; text-align: center; margin: 0;">
              This email was sent by Sales Page Forge. If you have any questions, please contact support.
            </p>
          </div>
        </body>
      </html>
    `
  });

  return result;
}
