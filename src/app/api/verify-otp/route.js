import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { email, otp, storedOtp, expiry } = await request.json();

    if (!email || !otp) {
      return NextResponse.json(
        { message: 'Email and OTP are required' },
        { status: 400 }
      );
    }

    // Check if OTP has expired
    if (Date.now() > expiry) {
      return NextResponse.json(
        { message: 'OTP has expired', verified: false },
        { status: 400 }
      );
    }

    // Verify OTP
    if (otp === storedOtp) {
      return NextResponse.json(
        { message: 'OTP verified successfully', verified: true },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        { message: 'Invalid OTP', verified: false },
        { status: 400 }
      );
    }

  } catch (error) {
    console.error('Error verifying OTP:', error);
    return NextResponse.json(
      { message: 'Failed to verify OTP', error: error.message },
      { status: 500 }
    );
  }
}
