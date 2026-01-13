import { NextResponse } from "next/server";
import twilio from "twilio";
import nodemailer from "nodemailer";

// Initialize Twilio
const twilioClient = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

// ✅ FIXED: createTransport (NOT createTransporter)
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: parseInt(process.env.SMTP_PORT || "587"),
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function POST(request) {
  try {
    const {
      patientName,
      patientPhone,
      familyEmail,
      familyPhone,
      newStatus,
      oldStatus,
      timestamp,
    } = await request.json();

    if (!patientName || !newStatus || !oldStatus) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const results = {
      email: null,
      sms: null,
    };

    // DYNAMIC EMOTIONAL CONTENT
    const isCriticalChange = newStatus === "Critical" && oldStatus === "Normal";
    const isRecoveryChange = newStatus === "Normal" && oldStatus === "Critical";
    const statusEmoji = newStatus === "Critical" ? "🚨" : "✅";

    // ========================================
    // SMS MESSAGES - EMOTIONAL
    // ========================================
    let smsBody;
    if (isCriticalChange) {
      smsBody = `🚨 EMERGENCY! ${patientName} deteriorated! NORMAL→CRITICAL ⚠️
📞 ${patientPhone} 
⏰ ${new Date(timestamp).toLocaleString("en-IN", { 
  day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" 
})}
⚕️ CONTACT HOSPITAL NOW!`;
    } else if (isRecoveryChange) {
      smsBody = `🎉 GOOD NEWS! ${patientName} RECOVERED! CRITICAL→NORMAL 😊
📞 ${patientPhone} 
⏰ ${new Date(timestamp).toLocaleString("en-IN", { 
  day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" 
})}
❤️ Patient STABLE!`;
    } else {
      smsBody = `${statusEmoji} ${patientName}: ${oldStatus}→${newStatus}
📞 ${patientPhone} 
⏰ ${new Date(timestamp).toLocaleString("en-IN", { 
  day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" 
})}`;
    }

    // ========================================
    // EMAIL - RICH DESIGN
    // ========================================
    const emailSubject = isCriticalChange 
      ? `🚨 EMERGENCY: ${patientName} - CRITICAL CONDITION!` 
      : isRecoveryChange 
      ? `🎉 WONDERFUL NEWS: ${patientName} RECOVERED!` 
      : `${newStatus === "Critical" ? "🚨 URGENT" : "✅ Update"}: ${patientName}`;

    const emailBody = `
      <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: linear-gradient(135deg, ${isCriticalChange ? '#fee2e2' : '#d1fae5'} 0%, #f9fafb 100%); border-radius: 16px;">
        <div style="background: linear-gradient(135deg, ${isCriticalChange ? '#ef4444,#dc2626' : isRecoveryChange ? '#10b981,#059669' : '#3b82f6,#1d4ed8'}); padding: 30px; border-radius: 16px 16px 0 0; text-align: center;">
          <div style="font-size: ${isCriticalChange ? '64px' : '56px'}; margin-bottom: 15px;">${isCriticalChange ? '🚨' : isRecoveryChange ? '🎉' : statusEmoji}</div>
          <h1 style="color: white; margin: 0; font-size: ${isCriticalChange ? '28px' : '24px'}; font-weight: 800;">
            ${isCriticalChange ? 'EMERGENCY ALERT!' : isRecoveryChange ? 'PATIENT RECOVERED!' : 'Health Update'}
          </h1>
        </div>
        
        <div style="background: white; padding: 35px; border-radius: 0 0 16px 16px;">
          <div style="background: ${isCriticalChange ? '#fee2e2' : isRecoveryChange ? '#d1fae5' : '#dbeafe'}; padding: 25px; border-radius: 12px; margin-bottom: 25px; border-left: 6px solid ${isCriticalChange ? '#ef4444' : isRecoveryChange ? '#10b981' : '#3b82f6'};">
            <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 8px;">
              <div style="font-size: 32px;">${statusEmoji}</div>
              <h2 style="margin: 0; color: ${isCriticalChange ? '#dc2626' : isRecoveryChange ? '#059669' : '#1e40af'}; font-size: 20px;">${patientName}</h2>
            </div>
            <p style="margin: 0 0 0 44px; font-size: 16px; color: #374151;">
              Status: <strong>${oldStatus}</strong> → <strong>${newStatus}</strong>
            </p>
          </div>

          <div style="background: #f8fafc; padding: 20px; border-radius: 12px; margin-bottom: 25px;">
            <h3 style="margin: 0 0 12px 0; color: #1e293b; font-size: 16px;">📞 Contact Info</h3>
            <div style="display: flex; align-items: center; gap: 8px; font-size: 16px; color: #475569;">
              <span style="font-size: 20px;">📱</span>
              <strong>${patientPhone}</strong>
            </div>
            <p style="margin: 8px 0 0 0; color: #64748b; font-size: 14px;">
              <strong>Time:</strong> ${new Date(timestamp).toLocaleString("en-IN", { 
                weekday: "long", year: "numeric", month: "long", day: "numeric", 
                hour: "2-digit", minute: "2-digit" 
              })}
            </p>
          </div>

          ${isCriticalChange ? `
            <div style="background: linear-gradient(90deg, #fef3c7 0%, #fde68a 100%); padding: 20px; border-radius: 12px; border: 3px solid #f59e0b; margin-bottom: 25px;">
              <h3 style="margin: 0 0 8px 0; color: #92400e; font-size: 18px;">⚠️ CRITICAL CONDITION</h3>
              <p style="margin: 0; color: #b45309; font-size: 15px;">Patient requires IMMEDIATE MEDICAL ATTENTION. Contact hospital NOW!</p>
            </div>
          ` : isRecoveryChange ? `
            <div style="background: linear-gradient(90deg, #d1fae5 0%, #a7f3d0 100%); padding: 20px; border-radius: 12px; border: 3px solid #10b981; margin-bottom: 25px;">
              <h3 style="margin: 0 0 8px 0; color: #065f46; font-size: 18px;">🎊 PATIENT STABILIZED</h3>
              <p style="margin: 0; color: #047857; font-size: 15px;">Patient has recovered from critical condition and is now stable!</p>
            </div>
          ` : ""}

          <div style="border-top: 2px solid #e2e8f0; padding-top: 25px; text-align: center;">
            <p style="color: #64748b; font-size: 14px; margin: 0;">🤖 Apollo Health Monitoring System</p>
          </div>
        </div>
      </div>
    `;

    // SEND EMAIL with YOUR SMTP CONFIG
    if (familyEmail && process.env.SMTP_USER && process.env.SMTP_PASS) {
      try {
        const emailInfo = await transporter.sendMail({
          from: process.env.FROM_EMAIL || `"Apollo Health Monitor" <${process.env.SMTP_USER}>`,
          to: familyEmail,
          subject: emailSubject,
          html: emailBody,
        });

        results.email = {
          success: true,
          recipient: familyEmail,
          messageId: emailInfo.messageId,
        };
        console.log("✅ Email sent to:", familyEmail);
      } catch (emailError) {
        console.error("❌ Email error:", emailError.message);
        results.email = {
          success: false,
          error: emailError.message,
        };
      }
    } else if (familyEmail) {
      results.email = {
        success: false,
        error: "SMTP credentials not configured (SMS still works)",
      };
      console.log("ℹ️ Email skipped - SMTP not configured");
    }

    // SEND SMS with Twilio
    if (familyPhone) {
      try {
        const formattedPhone = familyPhone.startsWith("+") ? familyPhone : `+91${familyPhone}`;
        
        const message = await twilioClient.messages.create({
          body: smsBody,
          from: process.env.TWILIO_PHONE_NUMBER,
          to: formattedPhone,
        });

        results.sms = {
          success: true,
          recipient: formattedPhone,
          messageSid: message.sid,
        };
        console.log("✅ SMS sent to:", formattedPhone);
      } catch (smsError) {
        console.error("❌ SMS error:", smsError.message);
        results.sms = {
          success: false,
          error: smsError.message,
        };
      }
    }

    const notificationMethods = [];
    if (results.email?.success) notificationMethods.push("email");
    if (results.sms?.success) notificationMethods.push("SMS");

    return NextResponse.json({
      success: true,
      results,
      methodsUsed: notificationMethods,
      message: notificationMethods.length > 0 
        ? `✅ Sent via: ${notificationMethods.join(", ")}`
        : "ℹ️ No contact info",
    }, { status: 200 });

  } catch (error) {
    console.error("❌ Server error:", error);
    return NextResponse.json({
      success: true,
      message: "Status updated successfully",
    }, { status: 200 });
  }
}
