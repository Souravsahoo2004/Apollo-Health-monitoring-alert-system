import nodemailer from 'nodemailer';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { name, email, phone, message } = await request.json();

    // Basic validation
    if (!name || !email || !message) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // ✅ FIXED: createTransport (NOT createTransporter)
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    // Test transporter connection
    await transporter.verify();

    // Send email
    await transporter.sendMail({
      from: `"Apollo Health" <${process.env.SMTP_USER}>`,
      to: 'souravsahoo72051@gmail.com', // Your support email
      replyTo: email,
      subject: `New Contact Form: ${name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2F4FA3;">🆕 New Contact Form Submission</h2>
          <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p><strong>👤 Name:</strong> ${name}</p>
            <p><strong>📧 Email:</strong> <a href="mailto:${email}">${email}</a></p>
            ${phone ? `<p><strong>📞 Phone:</strong> ${phone}</p>` : ''}
            <p><strong>💬 Message:</strong></p>
            <div style="background: white; padding: 15px; border-left: 4px solid #2F4FA3; margin-top: 10px;">
              ${message.replace(/\n/g, '<br>')}
            </div>
          </div>
          <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
          <p style="color: #666; font-size: 12px;">
            Submitted via Apollo Health Contact Form | ${new Date().toLocaleString()}
          </p>
        </div>
      `,
    });

    return NextResponse.json({ message: 'Email sent successfully!' });

  } catch (error) {
    console.error('🚨 Email Error:', error);
    return NextResponse.json(
      { error: 'Failed to send email. Please try again later.' }, 
      { status: 500 }
    );
  }
}
