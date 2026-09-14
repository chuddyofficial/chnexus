import "server-only";
import { Resend } from "resend";

const FROM_ADDRESS = "CH Nexus Support <support@chnexus.net>";

let resendClient: Resend | null = null;

function getResendClient(): Resend | null {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return null;
  if (!resendClient) {
    resendClient = new Resend(apiKey);
  }
  return resendClient;
}

export type SendReplyResult =
  | { success: true; messageId: string }
  | { success: false; error: string };

export async function sendSubmissionReply({
  to,
  recipientName,
  originalMessage,
  replyMessage,
}: {
  to: string;
  recipientName: string;
  originalMessage: string;
  replyMessage: string;
}): Promise<SendReplyResult> {
  const client = getResendClient();
  if (!client) {
    return {
      success: false,
      error:
        "Email sending is not configured (RESEND_API_KEY is missing on the server).",
    };
  }

  const html = renderReplyHtml({ recipientName, originalMessage, replyMessage });

  const { data, error } = await client.emails.send({
    from: FROM_ADDRESS,
    to,
    subject: "Re: Your message to CH Nexus",
    html,
    text: `Hi ${recipientName},\n\n${replyMessage}\n\n---\nYour original message:\n${originalMessage}\n\n— CH Nexus`,
  });

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true, messageId: data?.id ?? "" };
}

function escapeHtml(input: string): string {
  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function renderReplyHtml({
  recipientName,
  originalMessage,
  replyMessage,
}: {
  recipientName: string;
  originalMessage: string;
  replyMessage: string;
}): string {
  const name = escapeHtml(recipientName);
  const reply = escapeHtml(replyMessage).replace(/\n/g, "<br>");
  const original = escapeHtml(originalMessage).replace(/\n/g, "<br>");

  return `<!doctype html>
<html>
  <body style="margin:0;padding:0;background:#060810;font-family:Arial,Helvetica,sans-serif;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#060810;padding:32px 16px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" style="max-width:560px;background:#0d1120;border:1px solid #1f2842;border-radius:16px;overflow:hidden;">
            <tr>
              <td style="padding:28px 32px 0 32px;">
                <div style="font-size:14px;font-weight:700;letter-spacing:0.05em;color:#e8ebf5;">CH NEXUS</div>
              </td>
            </tr>
            <tr>
              <td style="padding:20px 32px 0 32px;">
                <p style="margin:0 0 16px 0;font-size:15px;color:#e8ebf5;">Hi ${name},</p>
                <p style="margin:0 0 24px 0;font-size:15px;line-height:1.6;color:#e8ebf5;">${reply}</p>
              </td>
            </tr>
            <tr>
              <td style="padding:0 32px;">
                <div style="border-top:1px solid #1f2842;padding-top:16px;">
                  <p style="margin:0 0 8px 0;font-size:12px;color:#8b93ad;">Your original message:</p>
                  <p style="margin:0;font-size:13px;line-height:1.6;color:#8b93ad;">${original}</p>
                </div>
              </td>
            </tr>
            <tr>
              <td style="padding:24px 32px 28px 32px;">
                <p style="margin:0;font-size:12px;color:#8b93ad;">— CH Nexus</p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}
