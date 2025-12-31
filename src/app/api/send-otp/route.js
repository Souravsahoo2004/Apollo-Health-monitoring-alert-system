import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

// Generate a random 6-digit OTP
function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function POST(request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { message: 'Email is required' },
        { status: 400 }
      );
    }

    // Generate OTP
    const otp = generateOTP();
    
    // Store OTP with expiration (5 minutes)
    const otpExpiry = Date.now() + 5 * 60 * 1000;

    // Configure nodemailer transporter
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    // Email content
    const mailOptions = {
      from: `"Apollo Health Monitoring" <${process.env.FROM_EMAIL}>`,
      to: email,
      subject: 'Email Verification - for Apollo Health Monitoring System ',
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h2 style="color: #2F4FA3;">Apollo Health Monitoring System</h2>
          <p>Your verification code is:</p>
          <h1 style="color: #2F4FA3; font-size: 32px; letter-spacing: 5px;">${otp}</h1>
          <p>This code will expire in 5 minutes.</p>
          <p>If you didn't request this code, please ignore this email.</p>
        </div>
      `,
    };

    // Send email
    await transporter.sendMail(mailOptions);

    // Return OTP and expiry (in production, store this in a database)
    return NextResponse.json(
      { 
        message: 'OTP sent successfully',
        otp: otp, // In production, don't send this - store in DB
        expiry: otpExpiry
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Error sending OTP:', error);
    return NextResponse.json(
      { message: 'Failed to send OTP', error: error.message },
      { status: 500 }
    );
  }
}
