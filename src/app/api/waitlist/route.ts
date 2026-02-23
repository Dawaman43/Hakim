import nodemailer from 'nodemailer';

export const runtime = 'nodejs';

function isLikelyEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export async function POST(req: Request) {
  try {
    const { contact } = await req.json();
    const value = String(contact || '').trim();
    if (!value) {
      return Response.json({ success: false, error: 'Contact is required.' }, { status: 400 });
    }

    const gmailUser = process.env.GMAIL_USER;
    const gmailPass = process.env.GMAIL_APP_PASSWORD;
    const fromName = process.env.FROM_NAME || 'Hakim';

    if (!gmailUser || !gmailPass) {
      return Response.json({ success: false, error: 'Email service not configured.' }, { status: 500 });
    }

    if (!isLikelyEmail(value)) {
      return Response.json({ success: false, error: 'Valid email is required.' }, { status: 400 });
    }

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: gmailUser,
        pass: gmailPass,
      },
    });

    await transporter.sendMail({
      from: `${fromName} <${gmailUser}>`,
      to: value,
      subject: 'Welcome to the Hakim waitlist',
      text: [
        'You are on the Hakim waitlist.',
        'Thanks for joining. You will get early access and a priority app experience when we launch.',
        'What to expect:',
        '- Early access invite',
        '- Priority onboarding',
        '- Fast, reliable booking built for Ethiopia',
        '',
        'If you did not request this, you can ignore this email.',
      ].join('\n'),
      html: `
        <div style="background:#f6f7f5;padding:24px 0;">
          <div style="max-width:600px;margin:0 auto;background:#ffffff;border:1px solid #e4e7e2;border-radius:16px;overflow:hidden;font-family:Arial, sans-serif;color:#0f1411;">
            <div style="padding:20px 24px;border-bottom:1px solid #e4e7e2;background:#fafafa;">
              <div style="font-size:14px;letter-spacing:0.04em;color:#2d4b32;font-weight:700;">HAKIM</div>
              <h1 style="margin:8px 0 4px;font-size:22px;">Welcome to the waitlist</h1>
              <p style="margin:0;color:#4b5450;font-size:14px;">You are in. Early access is reserved for you.</p>
            </div>
            <div style="padding:24px;">
              <p style="margin:0 0 12px;font-size:15px;line-height:1.6;">
                Thanks for joining the Hakim waitlist. We are building a fast, reliable mobile experience
                to help you skip the wait and get care faster.
              </p>
              <div style="margin:16px 0;padding:14px 16px;border:1px solid #e4e7e2;border-radius:12px;background:#f9faf9;">
                <div style="font-weight:700;margin-bottom:6px;">What you will get</div>
                <ul style="margin:0;padding-left:18px;color:#3f4a44;font-size:14px;line-height:1.6;">
                  <li>Early access invite</li>
                  <li>Priority onboarding experience</li>
                  <li>Real-time queue updates + SMS support</li>
                </ul>
              </div>
              <p style="margin:0 0 12px;font-size:14px;color:#4b5450;">
                We will email you as soon as the app is ready. For now, you can book tokens on the web.
              </p>
              <a href="https://hakim.et" style="display:inline-block;padding:10px 16px;border-radius:10px;background:#2d4b32;color:#ffffff;text-decoration:none;font-weight:600;">Book on Web</a>
            </div>
            <div style="padding:16px 24px;border-top:1px solid #e4e7e2;background:#fafafa;color:#6b7280;font-size:12px;">
              If you did not request this email, you can safely ignore it.
            </div>
          </div>
        </div>
      `,
    });

    return Response.json({ success: true });
  } catch (error) {
    console.error('Waitlist error:', error);
    return Response.json({ success: false, error: 'Failed to join waitlist.' }, { status: 500 });
  }
}
